# Contact Form Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform `/contact` from static mockup to functional submission flow with public POST endpoint, server-side validation, and IP rate-limit.

**Architecture:** New Drizzle column `contact_reason` (enum) added to `contacts`. Public endpoint `POST /api/contact` validates with shared Zod schema, applies in-memory rate-limit by IP, then calls existing `ContactsRepo.create()`. Page becomes server component shell hosting a new client component `<ContactForm />` (React Hook Form + Zod + React Query mutation) that swaps to `<ContactSuccess />` on success.

**Tech Stack:** Next.js 16 App Router · React 19 · TypeScript · Drizzle ORM 0.45 · Postgres · React Hook Form 7 · @hookform/resolvers · Zod 4 · TanStack Query 5 · Vitest 4 (jsdom) · Playwright (new install).

**Spec:** [`docs/superpowers/specs/2026-05-31-contact-form-design.md`](../specs/2026-05-31-contact-form-design.md)

---

## File Structure

### New files

| Path | Responsibility |
|------|----------------|
| `src/lib/contact/schema.ts` | Zod schema + types, shared client/server |
| `src/lib/contact/rate-limit.ts` | Pure in-memory rate-limit module (Map, GC, check function) |
| `src/lib/contact/reason-labels.ts` | French label map for the 4 `contact_reason` enum values |
| `src/app/api/contact/route.ts` | Public POST handler (validation + rate-limit + repo call) |
| `src/app/contact/contact-form.tsx` | Client component, RHF + useMutation |
| `src/app/contact/contact-success.tsx` | Success state UI |
| `tests/lib/contact/rate-limit.test.ts` | Vitest unit tests for rate-limit |
| `tests/lib/contact/schema.test.ts` | Vitest unit tests for Zod schema |
| `tests/e2e/contact.spec.ts` | Playwright e2e tests |
| `playwright.config.ts` | Playwright configuration |

### Modified files

| Path | Change |
|------|--------|
| `src/lib/db/schema.ts` | Add `contactReason` pgEnum + `reason` column on `contacts` table |
| `src/lib/db/repositories/contacts.ts` | Add `reason` to `ContactCreateInput`; insert it in `create()` |
| `src/app/contact/page.tsx` | Replace inline mockup form with `<ContactForm />` |
| `package.json` | Add `@playwright/test` dev dep + `test:e2e` script |
| `.gitignore` | Add `playwright-report/`, `test-results/`, `playwright/.cache/` |

### Out of scope (documented in spec, NOT in this plan)

- Admin `/admin/contacts` page tweak to use `row.reason` instead of the existing `reasonFromSubject` heuristic — the heuristic continues to work since `reason` is a new field; updating admin display is a separate cleanup PR.
- Filter by reason in admin list.
- Email notification (Resend / SMTP).
- Cloudflare Turnstile / honeypot.

---

## Runtime decision (rate-limit backend)

This plan implements the rate-limit as an **in-memory `Map`** at module scope. This works for long-running Node runtimes only (self-hosted, Docker, Fly.io, Railway). The project currently runs Postgres + Next.js in Docker locally, so this matches the dev environment.

**If/when the deployment target becomes serverless (Vercel, Cloudflare Workers, AWS Lambda)**, the in-memory Map becomes useless because each invocation can hit a fresh container. The migration path is documented in the spec (Upstash Redis, ~10 LOC swap inside `rate-limit.ts`) and is **not part of this plan**.

---

## Task 1: Add `contact_reason` enum + column to Drizzle schema

**Files:**
- Modify: `src/lib/db/schema.ts` (around lines 28–32 for the enum, around lines 199–221 for the contacts table)
- Generate: `drizzle/0002_<random>.sql` (auto-named by drizzle-kit)

- [ ] **Step 1: Add the `contactReason` pgEnum next to existing enums**

Edit `src/lib/db/schema.ts`. After the existing `contactStatus` enum (line ~28), add:

```ts
export const contactReason = pgEnum("contact_reason", [
  "article",
  "error",
  "qcm",
  "other",
]);
```

- [ ] **Step 2: Add the `reason` column to the `contacts` table**

In the same file, inside the `contacts = pgTable("contacts", { ... })` object (around line 199), add `reason` between `message` and `status`:

```ts
export const contacts = pgTable(
  "contacts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    subject: text("subject").notNull(),
    message: text("message").notNull(),
    reason: contactReason("reason").notNull().default("other"),
    status: contactStatus("status").notNull().default("unread"),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
      .notNull()
      .defaultNow(),
    handledAt: timestamp("handled_at", { withTimezone: true, mode: "date" }),
    handledByUserId: uuid("handled_by_user_id").references(
      (): AnyPgColumn => users.id,
      { onDelete: "set null" },
    ),
  },
  (t) => [
    index("contacts_status_idx").on(t.status),
    index("contacts_created_at_idx").on(t.createdAt),
  ],
);
```

**Note:** We keep `.default("other")` permanently (no follow-up `DROP DEFAULT`). This preserves backward-compatibility with the existing admin POST route at `src/app/api/admin/contacts/route.ts` which doesn't send `reason`. The public form always sets `reason` explicitly.

- [ ] **Step 3: Generate the migration**

Run: `npm run db:generate`
Expected: a new file `drizzle/0002_<random_name>.sql` is created containing:

```sql
CREATE TYPE "public"."contact_reason" AS ENUM('article', 'error', 'qcm', 'other');--> statement-breakpoint
ALTER TABLE "contacts" ADD COLUMN "reason" "contact_reason" DEFAULT 'other' NOT NULL;
```

If the generated SQL differs significantly (extra ALTERs unrelated to this change), STOP and investigate — there may be unrelated schema drift.

- [ ] **Step 4: Apply the migration**

Run: `npm run db:migrate`
Expected output ends with `Migrations complete.`

- [ ] **Step 5: Verify typecheck still passes**

Run: `npx tsc --noEmit`
Expected: no output (no errors).

- [ ] **Step 6: Commit**

```bash
git add src/lib/db/schema.ts drizzle/
git commit -m "feat(db): add contact_reason enum and column to contacts

Adds a structured 'reason' field to track why a visitor reached out
(article question / error report / QCM / other). Defaults to 'other'
to preserve backward-compatibility with the existing admin POST path.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 2: Extend `ContactsRepo.create()` to write `reason`

**Files:**
- Modify: `src/lib/db/repositories/contacts.ts` lines 13–19 (type) and 78–90 (create method)

- [ ] **Step 1: Add `reason` to `ContactCreateInput`**

Edit `src/lib/db/repositories/contacts.ts`. Change the import (line 4) to include the enum type:

```ts
import {
  contacts,
  type Contact,
  type ContactStatus,
} from "../schema";
```

Then add an import for the enum values at the same place:

```ts
import {
  contacts,
  contactReason,
  type Contact,
  type ContactStatus,
} from "../schema";
```

Add a type alias right above `ContactCreateInput` (around line 11):

```ts
export type ContactReason = (typeof contactReason.enumValues)[number];
```

Update `ContactCreateInput` (line 13) to require `reason`:

```ts
export type ContactCreateInput = {
  name: string;
  email: string;
  reason: ContactReason;
  subject: string;
  message: string;
  status?: ContactStatus;
};
```

- [ ] **Step 2: Pass `reason` into the insert**

In the same file, update `create()` (line 78):

```ts
async create(input: ContactCreateInput): Promise<Contact> {
  const [createdContact] = await db
    .insert(contacts)
    .values({
      name: input.name,
      email: input.email,
      reason: input.reason,
      subject: input.subject,
      message: input.message,
      status: input.status ?? "unread",
    })
    .returning();
  return createdContact;
},
```

- [ ] **Step 3: Verify typecheck**

Run: `npx tsc --noEmit`

Expected: typecheck PASSES because the existing admin POST route uses `ContactSchema` (which has no `reason`), and TypeScript will error on the missing field. **Fix:** in `src/app/api/admin/contacts/route.ts`, add the default reason before calling create. Change:

```ts
const input = ContactSchema.parse(body);
const contact = await ContactsRepo.create(input);
```

to:

```ts
const input = ContactSchema.parse(body);
const contact = await ContactsRepo.create({ ...input, reason: "other" });
```

Re-run `npx tsc --noEmit`. Expected: no output.

- [ ] **Step 4: Commit**

```bash
git add src/lib/db/repositories/contacts.ts src/app/api/admin/contacts/route.ts
git commit -m "feat(contacts): write reason field in repo create()

Threads the new contact_reason enum through ContactCreateInput.
Admin POST route defaults to 'other' since the admin form does not
collect reason (out of scope for this plan).

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 3: Shared Zod schema (TDD)

**Files:**
- Create: `src/lib/contact/schema.ts`
- Create: `src/lib/contact/reason-labels.ts`
- Test: `tests/lib/contact/schema.test.ts`

- [ ] **Step 1: Write the failing test**

Create `tests/lib/contact/schema.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { contactSubmissionSchema } from "@/lib/contact/schema";

const validInput = {
  name: "Mathieu Renaud",
  email: "m@example.fr",
  reason: "article" as const,
  subject: "Question sur le décret",
  message: "Bonjour, voici ma question détaillée.",
  consent: true,
};

describe("contactSubmissionSchema", () => {
  it("accepts a valid payload", () => {
    const result = contactSubmissionSchema.safeParse(validInput);
    expect(result.success).toBe(true);
  });

  it("trims whitespace on text fields", () => {
    const result = contactSubmissionSchema.safeParse({
      ...validInput,
      name: "  Léa  ",
    });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.name).toBe("Léa");
  });

  it("rejects name shorter than 2", () => {
    const result = contactSubmissionSchema.safeParse({ ...validInput, name: "A" });
    expect(result.success).toBe(false);
  });

  it("rejects invalid email", () => {
    const result = contactSubmissionSchema.safeParse({
      ...validInput,
      email: "not-an-email",
    });
    expect(result.success).toBe(false);
  });

  it("rejects unknown reason", () => {
    const result = contactSubmissionSchema.safeParse({
      ...validInput,
      reason: "spam",
    });
    expect(result.success).toBe(false);
  });

  it("rejects subject shorter than 3", () => {
    const result = contactSubmissionSchema.safeParse({
      ...validInput,
      subject: "Hi",
    });
    expect(result.success).toBe(false);
  });

  it("rejects message shorter than 10", () => {
    const result = contactSubmissionSchema.safeParse({
      ...validInput,
      message: "court",
    });
    expect(result.success).toBe(false);
  });

  it("rejects message longer than 4000", () => {
    const result = contactSubmissionSchema.safeParse({
      ...validInput,
      message: "x".repeat(4001),
    });
    expect(result.success).toBe(false);
  });

  it("rejects consent=false", () => {
    const result = contactSubmissionSchema.safeParse({
      ...validInput,
      consent: false,
    });
    expect(result.success).toBe(false);
  });
});
```

- [ ] **Step 2: Run the test, verify it fails**

Run: `npx vitest run tests/lib/contact/schema.test.ts`
Expected: FAIL with module not found error (`Cannot find module '@/lib/contact/schema'`).

- [ ] **Step 3: Write the schema**

Create `src/lib/contact/schema.ts`:

```ts
import { z } from "zod";

export const contactReasonSchema = z.enum([
  "article",
  "error",
  "qcm",
  "other",
]);

export type ContactReason = z.infer<typeof contactReasonSchema>;

export const contactSubmissionSchema = z.object({
  name: z.string().trim().min(2, "Nom trop court").max(80, "Nom trop long"),
  email: z
    .string()
    .trim()
    .email("E-mail invalide")
    .max(120, "E-mail trop long"),
  reason: contactReasonSchema,
  subject: z
    .string()
    .trim()
    .min(3, "Sujet trop court")
    .max(140, "Sujet trop long"),
  message: z
    .string()
    .trim()
    .min(10, "Message trop court")
    .max(4000, "Message trop long"),
  consent: z.literal(true, {
    message: "Consentement requis",
  }),
});

export type ContactSubmission = z.infer<typeof contactSubmissionSchema>;
```

- [ ] **Step 4: Create the reason labels module**

Create `src/lib/contact/reason-labels.ts`:

```ts
import type { ContactReason } from "./schema";

export const reasonLabels: Record<ContactReason, string> = {
  article: "Une question sur un article",
  error: "Signaler une erreur",
  qcm: "Une question sur un QCM",
  other: "Autre demande",
};

export const reasonDescriptions: Record<ContactReason, string> = {
  article: "Précision, source, complément",
  error: "Donnée fausse ou obsolète",
  qcm: "Code, paiement, certification",
  other: "Presse, partenariat, idée de sujet",
};

export const reasonOrder: ContactReason[] = ["article", "error", "qcm", "other"];
```

- [ ] **Step 5: Run the test, verify it passes**

Run: `npx vitest run tests/lib/contact/schema.test.ts`
Expected: all 9 tests pass.

- [ ] **Step 6: Commit**

```bash
git add src/lib/contact/schema.ts src/lib/contact/reason-labels.ts tests/lib/contact/schema.test.ts
git commit -m "feat(contact): add shared Zod submission schema and reason labels

Schema is consumed by both the public POST /api/contact handler and
the client-side React Hook Form resolver. Reason labels and order live
beside the schema so client and admin can map enum values to French.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 4: Pure rate-limit module (TDD)

**Files:**
- Create: `src/lib/contact/rate-limit.ts`
- Test: `tests/lib/contact/rate-limit.test.ts`

- [ ] **Step 1: Write the failing test**

Create `tests/lib/contact/rate-limit.test.ts`:

```ts
import { describe, expect, it, beforeEach } from "vitest";
import { checkRateLimit, resetRateLimit } from "@/lib/contact/rate-limit";

describe("checkRateLimit", () => {
  beforeEach(() => {
    resetRateLimit();
  });

  it("allows the first request from an IP", () => {
    const result = checkRateLimit("1.2.3.4", Date.now());
    expect(result.allowed).toBe(true);
  });

  it("allows up to 5 requests in the same window", () => {
    const now = 1_000_000;
    for (let i = 0; i < 5; i += 1) {
      const result = checkRateLimit("1.2.3.4", now);
      expect(result.allowed).toBe(true);
    }
  });

  it("blocks the 6th request in the same window", () => {
    const now = 1_000_000;
    for (let i = 0; i < 5; i += 1) checkRateLimit("1.2.3.4", now);
    const result = checkRateLimit("1.2.3.4", now);
    expect(result.allowed).toBe(false);
    expect(result.retryAfterSeconds).toBeGreaterThan(0);
    expect(result.retryAfterSeconds).toBeLessThanOrEqual(600);
  });

  it("isolates buckets per IP", () => {
    const now = 1_000_000;
    for (let i = 0; i < 5; i += 1) checkRateLimit("1.2.3.4", now);
    const result = checkRateLimit("5.6.7.8", now);
    expect(result.allowed).toBe(true);
  });

  it("resets the bucket after the 10-minute window expires", () => {
    const start = 1_000_000;
    for (let i = 0; i < 5; i += 1) checkRateLimit("1.2.3.4", start);
    const blocked = checkRateLimit("1.2.3.4", start + 9 * 60_000);
    expect(blocked.allowed).toBe(false);
    const allowed = checkRateLimit("1.2.3.4", start + 11 * 60_000);
    expect(allowed.allowed).toBe(true);
  });

  it("garbage-collects stale entries on check", () => {
    const start = 1_000_000;
    checkRateLimit("old-ip", start);
    // 30 minutes later, a different IP triggers a check
    checkRateLimit("new-ip", start + 30 * 60_000);
    // old-ip should be GC'd; a fresh window starts when it comes back
    const result = checkRateLimit("old-ip", start + 30 * 60_000 + 1);
    expect(result.allowed).toBe(true);
  });
});
```

- [ ] **Step 2: Run the test, verify it fails**

Run: `npx vitest run tests/lib/contact/rate-limit.test.ts`
Expected: FAIL with `Cannot find module '@/lib/contact/rate-limit'`.

- [ ] **Step 3: Implement the rate-limit module**

Create `src/lib/contact/rate-limit.ts`:

```ts
const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 5;

type Bucket = { count: number; windowStart: number };

const buckets = new Map<string, Bucket>();

export type RateLimitResult =
  | { allowed: true }
  | { allowed: false; retryAfterSeconds: number };

export function checkRateLimit(ip: string, now: number): RateLimitResult {
  gc(now);

  const bucket = buckets.get(ip);
  if (!bucket || now - bucket.windowStart >= WINDOW_MS) {
    buckets.set(ip, { count: 1, windowStart: now });
    return { allowed: true };
  }

  if (bucket.count < MAX_REQUESTS) {
    bucket.count += 1;
    return { allowed: true };
  }

  const elapsed = now - bucket.windowStart;
  const retryAfterMs = Math.max(0, WINDOW_MS - elapsed);
  return {
    allowed: false,
    retryAfterSeconds: Math.ceil(retryAfterMs / 1000),
  };
}

/** For tests only — clears all buckets. */
export function resetRateLimit(): void {
  buckets.clear();
}

function gc(now: number): void {
  for (const [ip, bucket] of buckets) {
    if (now - bucket.windowStart >= WINDOW_MS) {
      buckets.delete(ip);
    }
  }
}
```

- [ ] **Step 4: Run tests, verify they pass**

Run: `npx vitest run tests/lib/contact/rate-limit.test.ts`
Expected: all 6 tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/lib/contact/rate-limit.ts tests/lib/contact/rate-limit.test.ts
git commit -m "feat(contact): add in-memory IP rate-limit module

Sliding 10-minute window, 5 requests per IP. Pure module — accepts
'now' as a parameter for deterministic testing. Includes opportunistic
GC on each check to keep memory bounded. Module-scope Map only works
on long-running runtimes (Docker, self-hosted); see plan doc for the
Upstash migration path if/when the deploy target becomes serverless.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 5: Public `POST /api/contact` endpoint

**Files:**
- Create: `src/app/api/contact/route.ts`

No unit test on this file — the route is glue between modules already tested. Full integration coverage comes from Playwright in Task 8.

- [ ] **Step 1: Implement the route handler**

Create `src/app/api/contact/route.ts`:

```ts
import { NextRequest, NextResponse } from "next/server";
import { z, ZodError } from "zod";
import { ContactsRepo } from "@/lib/db/repositories/contacts";
import { contactSubmissionSchema } from "@/lib/contact/schema";
import { checkRateLimit } from "@/lib/contact/rate-limit";

export const runtime = "nodejs";

function getClientIp(req: NextRequest): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]!.trim();
  const xri = req.headers.get("x-real-ip");
  if (xri) return xri.trim();
  return "unknown";
}

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const limit = checkRateLimit(ip, Date.now());
  if (!limit.allowed) {
    return NextResponse.json(
      { code: "RATE_LIMITED", retryAfterSeconds: limit.retryAfterSeconds },
      {
        status: 429,
        headers: { "Retry-After": String(limit.retryAfterSeconds) },
      },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { code: "BAD_REQUEST", message: "Invalid JSON" },
      { status: 400 },
    );
  }

  let payload;
  try {
    payload = contactSubmissionSchema.parse(body);
  } catch (err) {
    if (err instanceof ZodError) {
      const flat = z.flattenError(err);
      return NextResponse.json(
        {
          code: "VALIDATION",
          fieldErrors: flat.fieldErrors,
          formErrors: flat.formErrors,
        },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { code: "BAD_REQUEST", message: "Invalid body" },
      { status: 400 },
    );
  }

  try {
    const contact = await ContactsRepo.create({
      name: payload.name,
      email: payload.email,
      reason: payload.reason,
      subject: payload.subject,
      message: payload.message,
    });
    return NextResponse.json({ id: contact.id }, { status: 201 });
  } catch (err) {
    console.error("POST /api/contact failed:", err);
    return NextResponse.json({ code: "INTERNAL" }, { status: 500 });
  }
}
```

- [ ] **Step 2: Smoke-test with curl (success path)**

In one terminal: `npm run dev`.
In another terminal:

```bash
curl -i -X POST http://localhost:3000/api/contact \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "Test User",
    "email": "test@example.fr",
    "reason": "article",
    "subject": "Smoke test",
    "message": "Hello from the smoke test of the contact endpoint.",
    "consent": true
  }'
```

Expected: `HTTP/1.1 201 Created` + body `{"id":"<uuid>"}`.

- [ ] **Step 3: Smoke-test validation failure**

```bash
curl -i -X POST http://localhost:3000/api/contact \
  -H 'Content-Type: application/json' \
  -d '{"name":"A","email":"bad","reason":"spam","subject":"x","message":"y","consent":false}'
```

Expected: `HTTP/1.1 400 Bad Request` + body containing `"code":"VALIDATION"` and a `fieldErrors` object with errors for each field.

- [ ] **Step 4: Smoke-test rate-limit**

Run the success-path curl from Step 2 six times in a row:

```bash
for i in 1 2 3 4 5 6; do
  curl -s -o /dev/null -w "%{http_code}\n" -X POST http://localhost:3000/api/contact \
    -H 'Content-Type: application/json' \
    -d '{"name":"Test","email":"t@example.fr","reason":"article","subject":"Smoke","message":"Repeated smoke test message.","consent":true}'
done
```

Expected output: `201` five times, then `429` on the sixth.

- [ ] **Step 5: Typecheck + lint**

Run: `npx tsc --noEmit && npm run lint`
Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add src/app/api/contact/route.ts
git commit -m "feat(api): add public POST /api/contact endpoint

Validates body against the shared Zod schema, applies the in-memory
IP rate-limit, and forwards to ContactsRepo.create(). Responds with
201/id on success, 400/VALIDATION on Zod failures, 429/Retry-After on
rate-limit, 500/INTERNAL on repo crashes.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 6: `<ContactSuccess />` component

**Files:**
- Create: `src/app/contact/contact-success.tsx`

- [ ] **Step 1: Create the success block**

Create `src/app/contact/contact-success.tsx`:

```tsx
"use client";

export function ContactSuccess({ onReset }: { onReset: () => void }) {
  return (
    <div className="grid gap-5 px-4 md:px-[22px] py-8">
      <div className="grid grid-cols-[40px_1fr] gap-4 items-start">
        <div className="text-signal text-3xl leading-none font-serif">✓</div>
        <div>
          <div className="mono text-[10px] tracking-[0.12em] uppercase text-signal">
            ◉ MESSAGE ENVOYÉ
          </div>
          <h2 className="h-title text-2xl md:text-3xl mt-1.5">
            Merci, votre message est bien arrivé.
          </h2>
          <p className="text-base text-ink-3 mt-2 leading-[1.5] max-w-[520px]">
            L&apos;équipe lit tout — nous répondons à l&apos;adresse e-mail
            indiquée sous 48 h en jours ouvrés.
          </p>
        </div>
      </div>
      <div className="border-t border-paper-line pt-4">
        <button
          type="button"
          onClick={onReset}
          className="btn btn--ghost"
        >
          ← Envoyer un autre message
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/app/contact/contact-success.tsx
git commit -m "feat(contact): add ContactSuccess client component

Replaces the form after a successful submission. Shows a confirmation
message and a 'send another message' button that calls back to the
form parent to reset state.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 7: `<ContactForm />` client component + wire into page

**Files:**
- Create: `src/app/contact/contact-form.tsx`
- Modify: `src/app/contact/page.tsx` (replace inline form with `<ContactForm />`)

The page becomes a thin server component shell hosting the client form. React Query needs a `QueryClientProvider`. The admin layout has one but the public layout does not, so the form gets its own scoped provider.

- [ ] **Step 1: Create the client form component**

Create `src/app/contact/contact-form.tsx`:

```tsx
"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  QueryClient,
  QueryClientProvider,
  useMutation,
} from "@tanstack/react-query";
import {
  contactSubmissionSchema,
  type ContactSubmission,
} from "@/lib/contact/schema";
import { reasonLabels, reasonOrder, reasonDescriptions } from "@/lib/contact/reason-labels";
import { ContactSuccess } from "./contact-success";

type ApiError = {
  code: string;
  fieldErrors?: Record<string, string[]>;
  retryAfterSeconds?: number;
  message?: string;
};

const queryClient = new QueryClient({
  defaultOptions: { mutations: { retry: 0 } },
});

async function submitContact(values: ContactSubmission): Promise<{ id: string }> {
  const res = await fetch("/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  });
  if (!res.ok) {
    let body: ApiError = { code: "UNKNOWN" };
    try {
      body = (await res.json()) as ApiError;
    } catch {
      /* ignore */
    }
    const err = new Error(body.code) as Error & { api: ApiError };
    err.api = body;
    throw err;
  }
  return (await res.json()) as { id: string };
}

function ContactFormInner() {
  const [submitted, setSubmitted] = React.useState(false);
  const [banner, setBanner] = React.useState<string | null>(null);

  const form = useForm<ContactSubmission>({
    resolver: zodResolver(contactSubmissionSchema),
    defaultValues: {
      name: "",
      email: "",
      reason: "article",
      subject: "",
      message: "",
      consent: false as unknown as true,
    },
    mode: "onBlur",
  });

  const mutation = useMutation({
    mutationFn: submitContact,
    onSuccess: () => {
      setBanner(null);
      setSubmitted(true);
    },
    onError: (err: Error & { api?: ApiError }) => {
      const api = err.api;
      if (api?.code === "VALIDATION" && api.fieldErrors) {
        Object.entries(api.fieldErrors).forEach(([field, messages]) => {
          const msg = messages?.[0];
          if (msg) {
            form.setError(field as keyof ContactSubmission, { message: msg });
          }
        });
        setBanner(null);
      } else if (api?.code === "RATE_LIMITED") {
        setBanner(
          `Trop de tentatives. Réessayez dans ${api.retryAfterSeconds ?? 600} secondes.`,
        );
      } else {
        setBanner(
          "Une erreur est survenue. Réessayez ou écrivez-nous directement à redac@maison-calorie.fr.",
        );
      }
    },
  });

  if (submitted) {
    return (
      <ContactSuccess
        onReset={() => {
          form.reset();
          setSubmitted(false);
        }}
      />
    );
  }

  const errors = form.formState.errors;
  const messageLength = (form.watch("message") ?? "").length;

  const onSubmit = form.handleSubmit((values) => mutation.mutate(values));

  return (
    <form onSubmit={onSubmit} className="grid gap-5 px-4 md:px-[22px] py-6">
      {banner ? (
        <div className="border border-signal bg-signal/10 text-ink px-4 py-3 text-sm">
          {banner}
        </div>
      ) : null}

      <div className="grid grid-cols-[24px_1fr] gap-2.5 px-3 py-2.5 bg-paper-2 border border-dashed border-paper-line">
        <span className="font-serif text-lg text-signal text-center leading-none">
          ⓘ
        </span>
        <div className="text-[13px] text-ink-3 leading-[1.45]">
          Les champs marqués d&apos;une étoile{" "}
          <span className="text-signal">*</span> sont obligatoires. Nous vous
          répondrons à l&apos;adresse e-mail indiquée, sous 48 h en jours
          ouvrés.
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        <div>
          <label
            htmlFor="ct-name"
            className="block text-sm font-semibold text-ink mb-1.5"
          >
            Votre nom complet <span className="text-signal">*</span>
          </label>
          <input
            id="ct-name"
            className="field text-[15px] px-3.5 py-3 h-auto"
            {...form.register("name")}
          />
          {errors.name ? (
            <div className="text-xs text-signal mt-1">{errors.name.message}</div>
          ) : (
            <div className="text-xs text-ink-mute mt-1 italic">
              Prénom et nom, comme vous souhaitez être appelé.
            </div>
          )}
        </div>
        <div>
          <label
            htmlFor="ct-email"
            className="block text-sm font-semibold text-ink mb-1.5"
          >
            Votre adresse e-mail <span className="text-signal">*</span>
          </label>
          <input
            id="ct-email"
            type="email"
            className="field text-[15px] px-3.5 py-3 h-auto"
            {...form.register("email")}
          />
          {errors.email ? (
            <div className="text-xs text-signal mt-1">{errors.email.message}</div>
          ) : (
            <div className="text-xs text-ink-mute mt-1 italic">
              C&apos;est ici que nous enverrons notre réponse.
            </div>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-ink mb-1.5">
          Motif de votre message <span className="text-signal">*</span>
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {reasonOrder.map((value) => (
            <label
              key={value}
              className="grid grid-cols-[20px_1fr] gap-2.5 px-3.5 py-3 cursor-pointer items-start border border-paper-line bg-paper has-[input:checked]:border-ink has-[input:checked]:bg-paper-2"
            >
              <input
                type="radio"
                value={value}
                {...form.register("reason")}
                className="mt-[3px]"
              />
              <div>
                <div className="text-sm font-semibold text-ink">
                  {reasonLabels[value]}
                </div>
                <div className="text-xs text-ink-3 mt-0.5">
                  {reasonDescriptions[value]}
                </div>
              </div>
            </label>
          ))}
        </div>
        {errors.reason ? (
          <div className="text-xs text-signal mt-1">{errors.reason.message}</div>
        ) : null}
      </div>

      <div>
        <label
          htmlFor="ct-subject"
          className="block text-sm font-semibold text-ink mb-1.5"
        >
          Sujet du message <span className="text-signal">*</span>
        </label>
        <input
          id="ct-subject"
          className="field text-[15px] px-3.5 py-3 h-auto"
          {...form.register("subject")}
        />
        {errors.subject ? (
          <div className="text-xs text-signal mt-1">{errors.subject.message}</div>
        ) : (
          <div className="text-xs text-ink-mute mt-1 italic">
            En une phrase courte. Ex. : « Précision sur le COP des PAC en 2026 ».
          </div>
        )}
      </div>

      <div>
        <label
          htmlFor="ct-msg"
          className="block text-sm font-semibold text-ink mb-1.5"
        >
          Votre message <span className="text-signal">*</span>
        </label>
        <textarea
          id="ct-msg"
          className="field font-sans text-[15px] leading-[1.55] px-3.5 py-3 resize-y h-auto"
          rows={9}
          {...form.register("message")}
        />
        <div className="flex flex-col md:flex-row md:justify-between mt-1 gap-1">
          {errors.message ? (
            <span className="text-xs text-signal">{errors.message.message}</span>
          ) : (
            <span className="text-xs text-ink-mute italic">
              Soyez aussi précis que possible — citez l&apos;article si besoin.
            </span>
          )}
          <span className="mono text-[11px] text-ink-mute">
            {messageLength} / 4000
          </span>
        </div>
      </div>

      <label className="grid grid-cols-[20px_1fr] gap-2.5 px-3.5 py-3 bg-paper-2 border border-paper-line cursor-pointer items-start">
        <input
          type="checkbox"
          {...form.register("consent")}
          className="mt-[3px]"
        />
        <div className="text-[13px] text-ink-2 leading-[1.45]">
          <strong>
            J&apos;accepte que mes données soient utilisées pour traiter ma
            demande.
          </strong>{" "}
          Elles ne seront ni revendues ni utilisées à d&apos;autres fins,
          conformément à notre{" "}
          <a href="#" className="lnk">
            politique de confidentialité
          </a>
          .
        </div>
      </label>
      {errors.consent ? (
        <div className="text-xs text-signal -mt-3">
          {errors.consent.message}
        </div>
      ) : null}

      <div className="flex flex-wrap gap-3 items-center border-t border-paper-line pt-4">
        <button
          type="submit"
          disabled={mutation.isPending}
          className="btn btn--primary text-base px-6 py-3.5 h-auto disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {mutation.isPending ? "Envoi en cours…" : "✉ Envoyer mon message"}
        </button>
        <button
          type="button"
          onClick={() => form.reset()}
          className="btn btn--ghost"
        >
          Annuler
        </button>
        <span className="text-xs text-ink-mute md:ml-auto italic">
          Réponse sous 48 h en jours ouvrés.
        </span>
      </div>
    </form>
  );
}

export function ContactForm() {
  return (
    <QueryClientProvider client={queryClient}>
      <ContactFormInner />
    </QueryClientProvider>
  );
}
```

- [ ] **Step 2: Replace the inline mockup form in the page**

Edit `src/app/contact/page.tsx`. Replace lines around the `<form>` block (the entire block from `<form className="grid gap-5 px-4 md:px-[22px] py-6">` through its closing `</form>`) with:

```tsx
<ContactForm />
```

Add the import at the top of the file:

```tsx
import { ContactForm } from "./contact-form";
```

Also remove from the same file:
- The now-unused `reasons` constant array (it's moved into `reason-labels.ts`).
- Any other unused imports flagged by ESLint.

The page becomes a server component again — keep it that way (no `"use client"` directive).

- [ ] **Step 3: Smoke-test in browser**

Run: `npm run dev`
Open: `http://localhost:3000/contact`

Manual checks (no automation here — Playwright covers it in Task 8):
1. Form renders with empty fields (no "Mathieu Renaud" pre-fill).
2. Consent checkbox is **NOT** pre-checked.
3. Submit empty form → errors appear under each required field.
4. Fill valid data, submit → form is replaced by the success block.
5. Click "Envoyer un autre message" → form re-appears, empty.

- [ ] **Step 4: Typecheck + lint**

Run: `npx tsc --noEmit && npm run lint`
Expected: no errors. ESLint may warn on existing unrelated lines (admin) — those are pre-existing.

- [ ] **Step 5: Commit**

```bash
git add src/app/contact/contact-form.tsx src/app/contact/page.tsx
git commit -m "feat(contact): wire ContactForm with RHF + React Query

Replaces the static /contact mockup with a real submission flow.
React Hook Form + zodResolver share the schema with the API. A scoped
QueryClientProvider hosts the useMutation that POSTs to /api/contact.
On success, the form is swapped for ContactSuccess (no redirect, URL
stays /contact). On validation errors from the server, fieldErrors
are re-injected via form.setError. Rate-limit and network errors
render a global banner.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 8: Playwright e2e setup + tests

**Files:**
- Create: `playwright.config.ts`
- Create: `tests/e2e/contact.spec.ts`
- Modify: `package.json` (add `@playwright/test` dev dep + `test:e2e` script)
- Modify: `.gitignore`

- [ ] **Step 1: Install Playwright**

Run: `npm install -D @playwright/test`
Then: `npx playwright install chromium`

Expected: install completes, the Chromium browser is downloaded.

- [ ] **Step 2: Add a `test:e2e` script to `package.json`**

In `package.json`, add to the `scripts` object:

```json
"test:e2e": "playwright test"
```

- [ ] **Step 3: Update `.gitignore`**

Append to `.gitignore`:

```
# Playwright
/playwright-report
/test-results
/playwright/.cache
```

- [ ] **Step 4: Create `playwright.config.ts`**

Create at repo root:

```ts
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  reporter: "list",
  use: {
    baseURL: "http://localhost:3000",
    trace: "retain-on-failure",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
  ],
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
```

- [ ] **Step 5: Write the e2e test file**

Create `tests/e2e/contact.spec.ts`:

```ts
import { test, expect } from "@playwright/test";

const VALID = {
  name: "Mathieu Renaud",
  email: "mathieu@example.fr",
  subject: "Question sur le décret PAC",
  message:
    "Bonjour, j'ai lu votre article et je voulais une précision sur le seuil COP.",
};

test.describe("Contact form", () => {
  test("submits a valid message and shows the success block", async ({
    page,
  }) => {
    await page.goto("/contact");

    await page.getByLabel("Votre nom complet").fill(VALID.name);
    await page.getByLabel("Votre adresse e-mail").fill(VALID.email);
    await page
      .getByRole("radio", { name: /Une question sur un article/ })
      .check();
    await page.getByLabel("Sujet du message").fill(VALID.subject);
    await page.getByLabel("Votre message").fill(VALID.message);
    await page.getByRole("checkbox").check();

    const responsePromise = page.waitForResponse(
      (res) => res.url().endsWith("/api/contact") && res.request().method() === "POST",
    );
    await page.getByRole("button", { name: /Envoyer mon message/ }).click();
    const response = await responsePromise;
    expect(response.status()).toBe(201);

    await expect(page.getByText("MESSAGE ENVOYÉ")).toBeVisible();
    await expect(
      page.getByText("Merci, votre message est bien arrivé."),
    ).toBeVisible();
  });

  test("blocks submit when consent is unchecked", async ({ page }) => {
    await page.goto("/contact");

    await page.getByLabel("Votre nom complet").fill(VALID.name);
    await page.getByLabel("Votre adresse e-mail").fill(VALID.email);
    await page
      .getByRole("radio", { name: /Une question sur un article/ })
      .check();
    await page.getByLabel("Sujet du message").fill(VALID.subject);
    await page.getByLabel("Votre message").fill(VALID.message);
    // intentionally skip the consent checkbox

    await page.getByRole("button", { name: /Envoyer mon message/ }).click();
    await expect(page.getByText("Consentement requis")).toBeVisible();
  });

  test("shows email validation error on invalid email", async ({ page }) => {
    await page.goto("/contact");

    await page.getByLabel("Votre nom complet").fill(VALID.name);
    await page.getByLabel("Votre adresse e-mail").fill("not-an-email");
    await page
      .getByRole("radio", { name: /Une question sur un article/ })
      .check();
    await page.getByLabel("Sujet du message").fill(VALID.subject);
    await page.getByLabel("Votre message").fill(VALID.message);
    await page.getByRole("checkbox").check();

    await page.getByRole("button", { name: /Envoyer mon message/ }).click();
    await expect(page.getByText("E-mail invalide")).toBeVisible();
  });

  test("resets to empty form after success", async ({ page }) => {
    await page.goto("/contact");
    await page.getByLabel("Votre nom complet").fill(VALID.name);
    await page.getByLabel("Votre adresse e-mail").fill(VALID.email);
    await page
      .getByRole("radio", { name: /Une question sur un article/ })
      .check();
    await page.getByLabel("Sujet du message").fill(VALID.subject);
    await page.getByLabel("Votre message").fill(VALID.message);
    await page.getByRole("checkbox").check();
    await page.getByRole("button", { name: /Envoyer mon message/ }).click();
    await expect(page.getByText("MESSAGE ENVOYÉ")).toBeVisible();

    await page
      .getByRole("button", { name: /Envoyer un autre message/ })
      .click();
    await expect(page.getByLabel("Votre nom complet")).toHaveValue("");
    await expect(page.getByLabel("Votre adresse e-mail")).toHaveValue("");
  });
});
```

**Note on the rate-limit test:** A 6×-submit test would require restarting the dev server between runs (rate-limit Map persists across tests in the same process) or hitting the limit on purpose and accepting cross-test pollution. We omit it here — the unit test in `tests/lib/contact/rate-limit.test.ts` already proves the limit triggers at 6 hits; the route's wiring to it is reviewable in `src/app/api/contact/route.ts`. If you want full-stack coverage, add it as a follow-up with a dedicated test bucket reset endpoint.

- [ ] **Step 6: Run the e2e tests**

Make sure no dev server is currently running (Playwright will spawn one via `webServer`).
Make sure Postgres is up (`docker compose ps` or your equivalent).

Run: `npm run test:e2e`

Expected: 4 tests pass.

- [ ] **Step 7: Commit**

```bash
git add playwright.config.ts tests/e2e/contact.spec.ts package.json package-lock.json .gitignore
git commit -m "test(contact): add Playwright e2e tests for contact form

Covers the happy path (valid submit → 201 → success block), client-side
validation (missing consent, invalid email), and post-success reset.
The rate-limit path is covered by the unit test on the pure module;
e2e omits it to avoid cross-test pollution of the in-memory bucket.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Final verification

After all tasks:

- [ ] Run full unit suite: `npm test`
  Expected: schema.test.ts (9 tests) + rate-limit.test.ts (6 tests) + pre-existing utils.test.ts all pass.

- [ ] Run e2e: `npm run test:e2e`
  Expected: 4 tests pass.

- [ ] Run typecheck + lint: `npx tsc --noEmit && npm run lint`
  Expected: 0 errors. Pre-existing warnings (react-hooks/incompatible-library on admin forms) are fine.

- [ ] Manual sanity check: open `/contact` in the browser, submit a valid message, verify the row appears in `/admin/contacts` with status `unread` and the correct `reason` value (visible via Drizzle Studio at `npm run db:studio` or by SQL: `SELECT name, email, reason, subject, status, created_at FROM contacts ORDER BY created_at DESC LIMIT 1`).

---

## Spec coverage check

| Spec requirement | Task |
|------------------|------|
| Migration: `contact_reason` enum | Task 1 |
| Migration: `reason` column on contacts | Task 1 |
| `ContactCreateInput` extended with reason | Task 2 |
| Shared Zod schema | Task 3 |
| French reason labels module | Task 3 |
| In-memory rate-limit Map, 5 req / 10 min | Task 4 |
| Rate-limit GC on each check | Task 4 |
| `POST /api/contact` route | Task 5 |
| IP extraction from `x-forwarded-for` / `x-real-ip` | Task 5 |
| 201/400/429/500 response shapes | Task 5 |
| `<ContactSuccess />` component | Task 6 |
| `<ContactForm />` client component (RHF + Zod + RQ) | Task 7 |
| Consent NOT pre-checked, REQUIRED | Task 7 (defaultValue + `z.literal(true)`) |
| Live message length counter | Task 7 |
| Server validation errors re-injected via `setError` | Task 7 |
| Rate-limit error banner | Task 7 |
| Network/500 fallback banner | Task 7 |
| Page stays at `/contact` (no redirect) | Task 7 |
| Vitest tests on rate-limit + schema | Task 4 + Task 3 |
| Playwright e2e tests | Task 8 |
