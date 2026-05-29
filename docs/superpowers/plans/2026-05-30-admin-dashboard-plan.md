# Admin Dashboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a localStorage-backed admin back-office under `(admin)/admin/*` with CRUD for Categories, Articles, Authors, Users, Media (visual only), and Contacts.

**Architecture:** Route group isolated from the public site. Mock data layer through repositories (sync localStorage behind async signatures) consumed via React Query. shadcn/ui for primitives, Tiptap for WYSIWYG. Public pages untouched.

**Tech Stack:** Next.js 16.2.4 (App Router), React 19.2.4, Tailwind v4, shadcn/ui, @tanstack/react-query v5, @tanstack/react-table v8, react-hook-form + zod, Tiptap v2, cmdk, sonner, next-themes, lucide-react, date-fns, vitest (added for TDD on pure functions).

**Spec:** `docs/superpowers/specs/2026-05-30-admin-dashboard-design.md`

---

## Reading order for agentic workers

1. Read the spec end-to-end first. The spec is the source of truth; this plan operationalizes it.
2. Before writing any framework code (route group layout, server components, params, metadata), open `node_modules/next/dist/docs/` and check the relevant doc — Next 16 APIs differ from older versions (cf. `AGENTS.md`).
3. Tailwind v4: utilities first inline on JSX. **Do NOT add new custom classes to `globals.css`** for styling that can be utility-expressed (cf. `AGENTS.md`).
4. **No `any`**. Use `unknown` + narrowing, generics, or proper inferred types (cf. `CLAUDE.md`). Legacy `any` in touched code should be replaced.

---

## Multi-agent parallelization map

Below: which tasks are sequential (block others) vs. parallel (can be dispatched simultaneously).

```
Task 1  Fondations              ─┐
Task 2  Repositories            ─┤  SEQUENTIAL (each depends on the previous)
Task 3  Shell + Dashboard       ─┤
Task 4  Shared data components  ─┘
        │
        ▼
        ┌────── Task 5.A Categories module  ──┐
        ├────── Task 5.B Authors module     ──┤  PARALLEL
        ├────── Task 5.C Users module       ──┤  (all 4 modules independent)
        └────── Task 5.D Contacts module    ──┘
        │
        ▼
Task 6  Articles module         ─┐
Task 7  Media module            ─┘  SEQUENTIAL (Task 6 must finish before Task 7
                                    because Task 7 needs the media-picker integrated
                                    with article forms for end-to-end testing)
```

When dispatching subagents via the SendMessage-First pattern (cf. project `CLAUDE.md`):
- **Pipeline phase (Tasks 1–4)**: pipeline `researcher → architect → coder → tester → reviewer`, single thread.
- **Fan-out phase (Tasks 5.A–5.D)**: spawn 4 coder agents in parallel, each named (`coder-categories`, `coder-authors`, `coder-users`, `coder-contacts`), each with its own tester. A `reviewer` waits for all 4 completions.
- **Articles + Media (Tasks 6, 7)**: pipeline again.

---

## File structure (locked in)

```
src/
├── app/
│   └── (admin)/
│       └── admin/
│           ├── layout.tsx
│           ├── page.tsx                              # dashboard
│           ├── categories/
│           │   ├── page.tsx                          # list
│           │   ├── new/page.tsx                      # create
│           │   └── [slug]/page.tsx                   # edit
│           ├── articles/
│           │   ├── page.tsx
│           │   ├── new/page.tsx
│           │   └── [id]/page.tsx
│           ├── auteurs/
│           │   ├── page.tsx
│           │   ├── new/page.tsx
│           │   └── [slug]/page.tsx
│           ├── utilisateurs/
│           │   ├── page.tsx
│           │   ├── new/page.tsx
│           │   └── [id]/page.tsx
│           ├── medias/page.tsx
│           └── contacts/
│               ├── page.tsx
│               └── [id]/page.tsx
├── components/
│   ├── admin/
│   │   ├── shell/
│   │   │   ├── admin-shell.tsx
│   │   │   ├── sidebar.tsx
│   │   │   ├── topbar.tsx
│   │   │   ├── command-palette.tsx
│   │   │   ├── breadcrumb.tsx
│   │   │   └── page-header.tsx
│   │   ├── data/
│   │   │   ├── data-table.tsx
│   │   │   ├── data-table-toolbar.tsx
│   │   │   ├── data-table-pagination.tsx
│   │   │   ├── column-header.tsx
│   │   │   ├── row-actions.tsx
│   │   │   └── bulk-actions-bar.tsx
│   │   ├── forms/
│   │   │   ├── form-section.tsx
│   │   │   ├── slug-input.tsx
│   │   │   ├── keywords-input.tsx
│   │   │   ├── status-select.tsx
│   │   │   ├── reading-time-input.tsx
│   │   │   ├── faq-editor.tsx
│   │   │   ├── media-picker.tsx
│   │   │   ├── relation-picker.tsx
│   │   │   └── rich-text-editor.tsx
│   │   ├── feedback/
│   │   │   ├── empty-state.tsx
│   │   │   ├── confirm-dialog.tsx
│   │   │   └── status-badge.tsx
│   │   └── kpi/
│   │       ├── stat-card.tsx
│   │       └── recent-list.tsx
│   └── ui/                                           # shadcn output (CLI-managed)
└── lib/
    └── admin/
        ├── types.ts
        ├── seed.ts
        ├── storage.ts
        ├── utils.ts                                  # ulid, slugify, sleep, readingTime
        ├── query-client.ts
        ├── use-admin-mutation.ts
        ├── use-table-filters.ts
        ├── repositories/
        │   ├── base.ts                               # RepositoryError, shared helpers
        │   ├── categories.ts
        │   ├── articles.ts
        │   ├── authors.ts
        │   ├── users.ts
        │   ├── medias.ts
        │   └── contacts.ts
        ├── queries/
        │   ├── use-categories.ts
        │   ├── use-articles.ts
        │   ├── use-authors.ts
        │   ├── use-users.ts
        │   ├── use-medias.ts
        │   └── use-contacts.ts
        └── validators/
            ├── category.ts
            ├── article.ts
            ├── author.ts
            ├── user.ts
            ├── media.ts
            └── contact.ts
```

Existing public files are **not touched**. Public pages keep reading from `src/lib/data.ts`.

---

# Task 1 — Fondations

**Goal:** Install dependencies, configure shadcn theme, create the typed data shell (types + utils + seed + storage) with passing unit tests for storage and utils.

**Files:**
- Modify: `package.json`, `eslint.config.mjs`, `src/app/globals.css`
- Create: `components.json`, `vitest.config.ts`, `src/lib/admin/types.ts`, `src/lib/admin/utils.ts`, `src/lib/admin/seed.ts`, `src/lib/admin/storage.ts`, `tests/lib/admin/utils.test.ts`, `tests/lib/admin/storage.test.ts`

---

### Task 1.1 — Install dependencies

- [ ] **Step 1: Install runtime deps**

Run:
```bash
npm install @tanstack/react-query @tanstack/react-table react-hook-form zod @hookform/resolvers @tiptap/react @tiptap/starter-kit @tiptap/extension-link @tiptap/extension-image @tiptap/extension-table @tiptap/extension-table-row @tiptap/extension-table-cell @tiptap/extension-table-header cmdk sonner next-themes date-fns lucide-react ulid class-variance-authority clsx tailwind-merge tw-animate-css
```

Expected: install completes. `package.json` `dependencies` now includes all above.

- [ ] **Step 2: Install dev deps for tests**

Run:
```bash
npm install -D vitest @vitest/coverage-v8 @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom @types/node
```

Expected: install completes.

- [ ] **Step 3: Verify install**

Run: `npm ls @tanstack/react-query @tiptap/react vitest`
Expected: all three listed at expected versions.

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: install admin dashboard deps (shadcn primitives, react-query, tiptap, vitest)"
```

---

### Task 1.2 — Configure Vitest

- [ ] **Step 1: Create `vitest.config.ts`**

```ts
import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./tests/setup.ts"],
    include: ["tests/**/*.test.{ts,tsx}"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

- [ ] **Step 2: Create `tests/setup.ts`**

```ts
import "@testing-library/jest-dom/vitest";

// localStorage shim for jsdom (already provided, but ensure clean state per test)
beforeEach(() => {
  localStorage.clear();
});
```

- [ ] **Step 3: Add npm scripts**

Modify `package.json` `scripts`:
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint",
    "test": "vitest run",
    "test:watch": "vitest"
  }
}
```

- [ ] **Step 4: Verify**

Run: `npm test`
Expected: "No test files found" — vitest config is valid.

- [ ] **Step 5: Commit**

```bash
git add vitest.config.ts tests/setup.ts package.json
git commit -m "chore: add vitest with jsdom env for admin TDD"
```

---

### Task 1.3 — Initialize shadcn/ui

- [ ] **Step 1: Run shadcn init**

Run:
```bash
npx shadcn@latest init -y -b neutral
```

Answer prompts if any:
- Style: default
- Base color: neutral
- CSS variables: yes
- React Server Components: yes

Expected: creates `components.json`, modifies `src/app/globals.css` (appends `@layer base { :root { … } }` with shadcn tokens), creates `src/lib/utils.ts` (the `cn` helper).

- [ ] **Step 2: Adjust shadcn theme to map onto Maison·Calorie tokens**

Open `src/app/globals.css`. Find the shadcn `:root { ... }` block. Replace the color variables with mappings onto our existing tokens, keeping shadcn-style HSL strings:

```css
:root {
  --background: 0 0% 100%;          /* paper */
  --foreground: 36 18% 7%;          /* ink */
  --card: 0 0% 100%;
  --card-foreground: 36 18% 7%;
  --popover: 0 0% 100%;
  --popover-foreground: 36 18% 7%;
  --primary: 36 18% 7%;             /* ink */
  --primary-foreground: 0 0% 100%;
  --secondary: 40 11% 95%;          /* paper-2 */
  --secondary-foreground: 36 18% 7%;
  --muted: 40 11% 95%;
  --muted-foreground: 39 8% 44%;    /* ink-mute */
  --accent: 14 80% 50%;             /* signal */
  --accent-foreground: 0 0% 100%;
  --destructive: 0 84% 45%;
  --destructive-foreground: 0 0% 100%;
  --border: 41 11% 80%;             /* paper-line */
  --input: 41 11% 80%;
  --ring: 14 80% 50%;               /* signal */
  --radius: 0.375rem;
}

.dark {
  --background: 36 18% 7%;
  --foreground: 40 11% 95%;
  --card: 36 22% 12%;
  --card-foreground: 40 11% 95%;
  --popover: 36 22% 12%;
  --popover-foreground: 40 11% 95%;
  --primary: 40 11% 95%;
  --primary-foreground: 36 18% 7%;
  --secondary: 36 18% 18%;
  --secondary-foreground: 40 11% 95%;
  --muted: 36 18% 18%;
  --muted-foreground: 40 6% 65%;
  --accent: 14 80% 55%;
  --accent-foreground: 0 0% 100%;
  --destructive: 0 70% 50%;
  --destructive-foreground: 0 0% 100%;
  --border: 36 18% 25%;
  --input: 36 18% 25%;
  --ring: 14 80% 55%;
}
```

- [ ] **Step 3: Add base shadcn primitives**

Run:
```bash
npx shadcn@latest add button input textarea select label form table dialog sheet dropdown-menu tabs card badge avatar checkbox skeleton command popover separator toast switch tooltip alert
```

Expected: creates `src/components/ui/*.tsx` for each primitive.

- [ ] **Step 4: Add sonner + theme**

```bash
npx shadcn@latest add sonner
```

Then create `src/components/theme-provider.tsx`:

```tsx
"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({ children, ...props }: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
```

- [ ] **Step 5: Verify build still passes**

Run: `npm run build`
Expected: build succeeds. Bundle size may grow ~80KB — acceptable.

- [ ] **Step 6: Commit**

```bash
git add components.json src/components/ui src/components/theme-provider.tsx src/lib/utils.ts src/app/globals.css
git commit -m "feat(admin): init shadcn with Maison·Calorie theme mapping"
```

---

### Task 1.4 — Create types

- [ ] **Step 1: Create `src/lib/admin/types.ts`**

Paste verbatim from spec section 4. Final file:

```ts
export type ID = string;
export type ISODate = string;
export type Slug = string;

export type Category = {
  id: ID;
  name: string;
  slug: Slug;
  descriptionHtml: string;
  articleCount: number;
  createdAt: ISODate;
  updatedAt: ISODate;
};

export type Author = {
  id: ID;
  name: string;
  slug: Slug;
  descriptionHtml: string;
  photoUrl: string | null;
  articleCount: number;
  createdAt: ISODate;
  updatedAt: ISODate;
};

export type MediaKind = "image" | "pdf";

export type Media = {
  id: ID;
  kind: MediaKind;
  url: string;
  filename: string;
  alt: string | null;
  caption: string | null;
  sizeBytes: number;
  width: number | null;
  height: number | null;
  pageCount: number | null;
  createdAt: ISODate;
};

export type ArticleStatus = "draft" | "published" | "archived";

export type FaqItem = {
  question: string;
  answer: string;
};

export type Article = {
  id: ID;
  title: string;
  slug: Slug;
  seoExcerpt: string;
  metaDescription: string;
  metaKeywords: string[];
  contentHtml: string;
  coverMediaId: ID | null;
  attachedMediaIds: ID[];
  readingMinutes: number;
  categoryId: ID;
  authorId: ID;
  faqs: FaqItem[];
  status: ArticleStatus;
  publishedAt: ISODate | null;
  createdAt: ISODate;
  updatedAt: ISODate;
};

export type UserRole = "admin" | "editor" | "reader";
export type UserStatus = "active" | "suspended";

export type User = {
  id: ID;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  status: UserStatus;
  lastLoginAt: ISODate | null;
  createdAt: ISODate;
};

export type ContactStatus = "unread" | "handled" | "archived";

export type ContactSubmission = {
  id: ID;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: ContactStatus;
  createdAt: ISODate;
  handledAt: ISODate | null;
  handledByUserId: ID | null;
};

export type Snapshot = {
  version: 1;
  categories: Category[];
  articles: Article[];
  authors: Author[];
  users: User[];
  medias: Media[];
  contacts: ContactSubmission[];
};

export class RepositoryError extends Error {
  constructor(public code: string, public details: Record<string, unknown> = {}) {
    super(code);
    this.name = "RepositoryError";
  }
}
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/lib/admin/types.ts
git commit -m "feat(admin): add domain types and Snapshot shape"
```

---

### Task 1.5 — Utilities with tests

- [ ] **Step 1: Write failing tests `tests/lib/admin/utils.test.ts`**

```ts
import { describe, expect, it } from "vitest";
import { slugify, readingMinutesFromHtml, isUniqueSlug } from "@/lib/admin/utils";

describe("slugify", () => {
  it("lowercases and removes diacritics", () => {
    expect(slugify("Pompes à chaleur")).toBe("pompes-a-chaleur");
    expect(slugify("Réglementation")).toBe("reglementation");
  });

  it("collapses whitespace and special chars", () => {
    expect(slugify("Aides &  financement!")).toBe("aides-financement");
    expect(slugify("  Léa  Marchand  ")).toBe("lea-marchand");
  });

  it("strips leading/trailing dashes", () => {
    expect(slugify("---hello---")).toBe("hello");
  });

  it("returns empty string for empty input", () => {
    expect(slugify("")).toBe("");
    expect(slugify("   ")).toBe("");
  });
});

describe("readingMinutesFromHtml", () => {
  it("returns at least 1 minute", () => {
    expect(readingMinutesFromHtml("<p>Court</p>")).toBe(1);
  });

  it("rounds based on 220 words per minute", () => {
    const html = "<p>" + "mot ".repeat(440) + "</p>";
    expect(readingMinutesFromHtml(html)).toBe(2);
  });

  it("strips html tags before counting", () => {
    const html = "<p><strong>un deux trois</strong></p>";
    expect(readingMinutesFromHtml(html)).toBe(1);
  });
});

describe("isUniqueSlug", () => {
  it("returns true if slug is absent from existing list", () => {
    expect(isUniqueSlug("new", [{ slug: "old" }, { slug: "other" }])).toBe(true);
  });

  it("returns false if slug exists", () => {
    expect(isUniqueSlug("old", [{ slug: "old" }])).toBe(false);
  });

  it("ignores excluded id (for edits)", () => {
    expect(isUniqueSlug("same", [{ slug: "same", id: "1" }], "1")).toBe(true);
    expect(isUniqueSlug("same", [{ slug: "same", id: "1" }], "2")).toBe(false);
  });
});
```

- [ ] **Step 2: Run tests, verify they fail**

Run: `npm test`
Expected: 3 failing test suites — module not found.

- [ ] **Step 3: Implement `src/lib/admin/utils.ts`**

```ts
import { ulid as ulidGen } from "ulid";

export function ulid(): string {
  return ulidGen();
}

export function nowIso(): string {
  return new Date().toISOString();
}

export function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

export function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function readingMinutesFromHtml(html: string): number {
  const text = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  const wordCount = text ? text.split(" ").length : 0;
  return Math.max(1, Math.round(wordCount / 220));
}

export function isUniqueSlug<T extends { slug: string; id?: string }>(
  slug: string,
  existing: T[],
  excludeId?: string,
): boolean {
  return !existing.some((e) => e.slug === slug && e.id !== excludeId);
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} Mo`;
}
```

- [ ] **Step 4: Run tests, verify they pass**

Run: `npm test`
Expected: 3 suites passing, 10+ tests passing.

- [ ] **Step 5: Commit**

```bash
git add src/lib/admin/utils.ts tests/lib/admin/utils.test.ts
git commit -m "feat(admin): add utils (slugify, readingMinutes, uniqueSlug) with tests"
```

---

### Task 1.6 — Storage with tests

- [ ] **Step 1: Write failing tests `tests/lib/admin/storage.test.ts`**

```ts
import { describe, expect, it } from "vitest";
import { load, save, reset, STORAGE_KEY } from "@/lib/admin/storage";

describe("storage", () => {
  it("returns seed when localStorage is empty", () => {
    const snap = load();
    expect(snap.version).toBe(1);
    expect(snap.categories.length).toBeGreaterThan(0);
    expect(snap.articles.length).toBeGreaterThan(0);
  });

  it("persists snapshot on save and re-reads it", () => {
    const snap = load();
    const next = { ...snap, categories: snap.categories.slice(0, 1) };
    save(next);
    const reread = load();
    expect(reread.categories).toHaveLength(1);
  });

  it("rewrites seed on reset", () => {
    const snap = load();
    save({ ...snap, categories: [] });
    expect(load().categories).toHaveLength(0);
    reset();
    expect(load().categories.length).toBeGreaterThan(0);
  });

  it("re-seeds if stored version is older", () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 0, categories: [], articles: [], authors: [], users: [], medias: [], contacts: [] }));
    const snap = load();
    expect(snap.version).toBe(1);
    expect(snap.categories.length).toBeGreaterThan(0);
  });
});
```

- [ ] **Step 2: Run tests, verify they fail (missing module)**

Run: `npm test storage`
Expected: failures.

- [ ] **Step 3: Stub seed** — create minimal `src/lib/admin/seed.ts` so storage compiles. Full seed comes in Task 1.7.

```ts
import type { Snapshot } from "./types";

export function buildSeed(): Snapshot {
  return {
    version: 1,
    categories: [
      { id: "seed-cat-1", name: "Isolation", slug: "isolation", descriptionHtml: "<p>Stub.</p>", articleCount: 0, createdAt: "2026-05-01T00:00:00Z", updatedAt: "2026-05-01T00:00:00Z" },
    ],
    articles: [],
    authors: [],
    users: [],
    medias: [],
    contacts: [],
  };
}
```

- [ ] **Step 4: Implement `src/lib/admin/storage.ts`**

```ts
import type { Snapshot } from "./types";
import { buildSeed } from "./seed";

export const STORAGE_KEY = "mc.admin.v1";
const CURRENT_VERSION = 1;

function read(): Snapshot | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Snapshot;
    if (parsed.version !== CURRENT_VERSION) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function load(): Snapshot {
  const existing = read();
  if (existing) return existing;
  const seed = buildSeed();
  save(seed);
  return seed;
}

export function save(snapshot: Snapshot): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
}

export function reset(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
  load();
}
```

- [ ] **Step 5: Run tests, verify they pass**

Run: `npm test storage`
Expected: 4 tests passing.

- [ ] **Step 6: Commit**

```bash
git add src/lib/admin/storage.ts src/lib/admin/seed.ts tests/lib/admin/storage.test.ts
git commit -m "feat(admin): add versioned localStorage snapshot with seed"
```

---

### Task 1.7 — Full seed

- [ ] **Step 1: Replace `src/lib/admin/seed.ts` with full seed**

Build a realistic seed per spec section 11. The seed file is generated deterministically at module load — no randomness, fixed timestamps. Key targets:

- **8 categories**: same 8 slugs as `CATEGORIES` in `src/lib/data.ts`, each with `descriptionHtml` (2-3 sentences).
- **6 authors**: 5 existing names from `SAMPLE_ARTICLES` + 1 invented ("Théo Lemoine"). Each with `photoUrl` from `i.pravatar.cc?img=N` (n=12, 25, 47, 13, 33, 51), short bio HTML.
- **30 medias**: 25 images (extract URLs from existing `IMG_BANK` in `src/lib/data.ts` + add ~10 more from Unsplash search related to home retrofits) + 5 mock PDFs (use a stable placeholder URL like `https://www.africau.edu/images/default/sample.pdf`). Width/height for images, pageCount for PDFs.
- **20 articles**: 8 from `SAMPLE_ARTICLES` enriched (build `contentHtml` with `<h2>`, `<p>`, `<ul>` covering 3–6 paragraphs each; 2–3 FAQs; cover from medias; 1-2 attached). + 12 generated (cycle authors/categories, vary status: 14 published, 4 draft, 2 archived).
- **5 users**: `soufianosse@gmail.com` (admin, active), 2 editor, 2 reader. `lastLoginAt` recent ISO.
- **12 contacts**: 5 unread, 4 handled, 3 archived, dates spanning the last 30 days from `2026-05-30`.

The seed module exports `buildSeed(): Snapshot`. Use a fixed `BASE_TIME = "2026-05-01T00:00:00Z"` for `createdAt`/`updatedAt` so tests are deterministic. Use ULIDs prefixed by entity type (e.g., `"cat_01H..."`) for readability — generate them once and hardcode (not at module load).

Aim for ~500 lines. **Do not skip content** — the seed is the demo. Use the existing `SAMPLE_ARTICLES` titles/deks as starting points.

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Verify storage tests still pass**

Run: `npm test storage`
Expected: 4 tests passing (existing tests assert lengths > 0; now they get realistic data).

- [ ] **Step 4: Add a sanity test asserting seed counts**

Append to `tests/lib/admin/storage.test.ts`:

```ts
describe("seed counts", () => {
  it("matches spec section 11", () => {
    const snap = load();
    expect(snap.categories).toHaveLength(8);
    expect(snap.authors).toHaveLength(6);
    expect(snap.articles).toHaveLength(20);
    expect(snap.users).toHaveLength(5);
    expect(snap.medias).toHaveLength(30);
    expect(snap.contacts).toHaveLength(12);
  });

  it("seed admin user is soufianosse@gmail.com", () => {
    const admin = load().users.find((u) => u.role === "admin");
    expect(admin?.email).toBe("soufianosse@gmail.com");
  });
});
```

Run: `npm test storage`
Expected: all tests passing.

- [ ] **Step 5: Commit**

```bash
git add src/lib/admin/seed.ts tests/lib/admin/storage.test.ts
git commit -m "feat(admin): build full seed (8 cat, 6 auth, 20 art, 30 media, 5 usr, 12 ctc)"
```

---

# Task 2 — Repositories layer

**Goal:** A typed CRUD layer that reads/writes the snapshot for each entity, simulating async, with referential guards. Unit-tested.

**Files:**
- Create: `src/lib/admin/repositories/{base,categories,articles,authors,users,medias,contacts}.ts`
- Create: tests under `tests/lib/admin/repositories/`

---

### Task 2.1 — Base repository helpers

- [ ] **Step 1: Create `src/lib/admin/repositories/base.ts`**

```ts
import { load, save } from "../storage";
import type { Snapshot } from "../types";
import { sleep } from "../utils";

const WRITE_DELAY_MS = 120;

export async function readSnapshot(): Promise<Snapshot> {
  await sleep(40);
  return load();
}

export async function writeSnapshot(snapshot: Snapshot): Promise<void> {
  await sleep(WRITE_DELAY_MS);
  save(snapshot);
}

export async function mutate<R>(updater: (snap: Snapshot) => { next: Snapshot; result: R }): Promise<R> {
  const snap = load();
  const { next, result } = updater(snap);
  await sleep(WRITE_DELAY_MS);
  save(next);
  return result;
}
```

- [ ] **Step 2: No tests at this layer** — covered indirectly by entity repos.

- [ ] **Step 3: Commit**

```bash
git add src/lib/admin/repositories/base.ts
git commit -m "feat(admin): repository base helpers (readSnapshot, mutate)"
```

---

### Task 2.2 — Categories repository

- [ ] **Step 1: Write failing tests `tests/lib/admin/repositories/categories.test.ts`**

```ts
import { describe, expect, it } from "vitest";
import { CategoriesRepo } from "@/lib/admin/repositories/categories";
import { RepositoryError } from "@/lib/admin/types";
import { load, save } from "@/lib/admin/storage";

describe("CategoriesRepo", () => {
  it("lists categories with derived articleCount", async () => {
    const result = await CategoriesRepo.list();
    expect(result.length).toBeGreaterThan(0);
    const isolation = result.find((c) => c.slug === "isolation");
    expect(isolation?.articleCount).toBeGreaterThanOrEqual(0);
  });

  it("filters by q (name or slug)", async () => {
    const result = await CategoriesRepo.list({ q: "isol" });
    expect(result.every((c) => c.name.toLowerCase().includes("isol") || c.slug.includes("isol"))).toBe(true);
  });

  it("creates a new category", async () => {
    const created = await CategoriesRepo.create({
      name: "Domotique",
      slug: "domotique",
      descriptionHtml: "<p>Hello.</p>",
    });
    expect(created.id).toBeTruthy();
    expect(created.slug).toBe("domotique");
    const all = await CategoriesRepo.list();
    expect(all.some((c) => c.id === created.id)).toBe(true);
  });

  it("rejects duplicate slug on create", async () => {
    await expect(
      CategoriesRepo.create({ name: "X", slug: "isolation", descriptionHtml: "" }),
    ).rejects.toThrow(RepositoryError);
  });

  it("updates a category", async () => {
    const updated = await CategoriesRepo.update("seed-cat-isolation", { name: "Isolation 2" });
    expect(updated.name).toBe("Isolation 2");
  });

  it("blocks remove when articles reference it", async () => {
    // Use a seeded category that has articles
    const cat = (await CategoriesRepo.list()).find((c) => c.articleCount > 0);
    expect(cat).toBeTruthy();
    await expect(CategoriesRepo.remove(cat!.id)).rejects.toThrow(RepositoryError);
  });

  it("removes a category without articles", async () => {
    // Seed an orphan category
    const snap = load();
    save({ ...snap, categories: [...snap.categories, { id: "orphan", name: "Orphan", slug: "orphan", descriptionHtml: "", articleCount: 0, createdAt: "2026-01-01T00:00:00Z", updatedAt: "2026-01-01T00:00:00Z" }] });
    await CategoriesRepo.remove("orphan");
    const after = await CategoriesRepo.list();
    expect(after.some((c) => c.id === "orphan")).toBe(false);
  });
});
```

(NB: `seed-cat-isolation` is the ID convention you must use in `seed.ts` from Task 1.7. If you used a different naming scheme, update both seed and tests to match.)

- [ ] **Step 2: Run tests, expect failures**

Run: `npm test categories`
Expected: module not found.

- [ ] **Step 3: Implement `src/lib/admin/repositories/categories.ts`**

```ts
import { mutate, readSnapshot } from "./base";
import type { Category, ID } from "../types";
import { RepositoryError } from "../types";
import { isUniqueSlug, nowIso, ulid } from "../utils";

export type CategoryFilter = {
  q?: string;
  sort?: "name" | "newest" | "oldest";
};

function withArticleCount(snap: { categories: Category[]; articles: { categoryId: ID }[] }): Category[] {
  return snap.categories.map((c) => ({
    ...c,
    articleCount: snap.articles.filter((a) => a.categoryId === c.id).length,
  }));
}

export const CategoriesRepo = {
  async list(filter: CategoryFilter = {}): Promise<Category[]> {
    const snap = await readSnapshot();
    let items = withArticleCount(snap);
    if (filter.q) {
      const q = filter.q.toLowerCase();
      items = items.filter((c) => c.name.toLowerCase().includes(q) || c.slug.includes(q));
    }
    switch (filter.sort) {
      case "name":
        items.sort((a, b) => a.name.localeCompare(b.name, "fr"));
        break;
      case "oldest":
        items.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
        break;
      case "newest":
      default:
        items.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    }
    return items;
  },

  async get(id: ID): Promise<Category | null> {
    const snap = await readSnapshot();
    const found = withArticleCount(snap).find((c) => c.id === id);
    return found ?? null;
  },

  async getBySlug(slug: string): Promise<Category | null> {
    const snap = await readSnapshot();
    const found = withArticleCount(snap).find((c) => c.slug === slug);
    return found ?? null;
  },

  async create(input: Omit<Category, "id" | "articleCount" | "createdAt" | "updatedAt">): Promise<Category> {
    return mutate((snap) => {
      if (!isUniqueSlug(input.slug, snap.categories)) {
        throw new RepositoryError("SLUG_TAKEN", { slug: input.slug });
      }
      const now = nowIso();
      const created: Category = {
        ...input,
        id: `cat_${ulid()}`,
        articleCount: 0,
        createdAt: now,
        updatedAt: now,
      };
      return { next: { ...snap, categories: [...snap.categories, created] }, result: created };
    });
  },

  async update(id: ID, patch: Partial<Omit<Category, "id" | "articleCount" | "createdAt">>): Promise<Category> {
    return mutate((snap) => {
      const idx = snap.categories.findIndex((c) => c.id === id);
      if (idx < 0) throw new RepositoryError("NOT_FOUND", { id });
      if (patch.slug && !isUniqueSlug(patch.slug, snap.categories, id)) {
        throw new RepositoryError("SLUG_TAKEN", { slug: patch.slug });
      }
      const updated: Category = { ...snap.categories[idx], ...patch, updatedAt: nowIso() };
      const next = { ...snap, categories: [...snap.categories.slice(0, idx), updated, ...snap.categories.slice(idx + 1)] };
      const articleCount = next.articles.filter((a) => a.categoryId === id).length;
      return { next, result: { ...updated, articleCount } };
    });
  },

  async remove(id: ID): Promise<void> {
    return mutate((snap) => {
      const referenced = snap.articles.filter((a) => a.categoryId === id).length;
      if (referenced > 0) throw new RepositoryError("CATEGORY_HAS_ARTICLES", { count: referenced });
      const next = { ...snap, categories: snap.categories.filter((c) => c.id !== id) };
      return { next, result: undefined };
    });
  },
};
```

- [ ] **Step 4: Run tests, verify they pass**

Run: `npm test categories`
Expected: 7 tests passing.

- [ ] **Step 5: Commit**

```bash
git add src/lib/admin/repositories/categories.ts tests/lib/admin/repositories/categories.test.ts
git commit -m "feat(admin): categories repository with guards and sort/filter"
```

---

### Task 2.3 — Authors repository

Structural twin of `CategoriesRepo`, with these differences:
- Filter type: `AuthorFilter = { q?: string; sort?: "name" | "newest" | "oldest" }`. Search matches `name` and `slug`.
- `withArticleCount` joins on `articles.authorId`.
- `create` rejects duplicate slug → `SLUG_TAKEN`.
- `remove` rejects with `AUTHOR_HAS_ARTICLES` (details: `{ count }`) when any article references the author.
- Mutable fields on update: `name`, `slug`, `descriptionHtml`, `photoUrl`. `photoUrl` is `string | null`.

- [ ] **Step 1: Write tests `tests/lib/admin/repositories/authors.test.ts`**

Mirror the 7 test cases from `categories.test.ts` but with author-specific data:
- `list()` returns seeded authors with `articleCount` derived.
- `list({ q: "lea" })` matches.
- `create({ name, slug, descriptionHtml: "", photoUrl: null })` returns new with id.
- duplicate slug rejected with `SLUG_TAKEN`.
- `update(id, { name: "X" })` works and preserves `articleCount`.
- `remove` of a seeded author with articles throws `AUTHOR_HAS_ARTICLES`.
- `remove` of a freshly-created orphan author succeeds.

- [ ] **Step 2: Implement `src/lib/admin/repositories/authors.ts`**

Same file structure as `categories.ts` (Task 2.2 step 3), with these substitutions:
- Replace `Category` with `Author`, `categories` with `authors`, `categoryId` with `authorId` throughout.
- `create` Omit type: `Omit<Author, "id" | "articleCount" | "createdAt" | "updatedAt">` (note `photoUrl` is required in input but can be `null`).
- `id` prefix: `auth_${ulid()}`.
- Error code on `remove`: `AUTHOR_HAS_ARTICLES`.

- [ ] **Step 3: Run tests**: `npm test authors` — expect 7 passing.
- [ ] **Step 4: Commit**: `feat(admin): authors repository with guards`.

---

### Task 2.4 — Users repository

- [ ] **Step 1: Tests** `tests/lib/admin/repositories/users.test.ts`

Test cases:
- `list()` returns ≥5 users from seed
- `list({ role: "admin" })` filters by role
- `list({ status: "suspended" })` filters by status
- `list({ q: "soufiane" })` matches firstName/lastName/email
- `create({ email, firstName, lastName, role, status })` rejects duplicate email (`EMAIL_TAKEN`)
- `update(id, { status: "suspended" })` works
- `remove(id)` works (no referential blocker)

- [ ] **Step 2: Implement `src/lib/admin/repositories/users.ts`**

Shape similar to categories but with these distinct fields:
```ts
export type UserFilter = {
  q?: string;
  role?: UserRole | "all";
  status?: UserStatus | "all";
  sort?: "newest" | "oldest" | "name";
};
```

Email uniqueness check (case-insensitive). No derived counts.

- [ ] **Step 3: Run tests**, expect green.
- [ ] **Step 4: Commit**: `feat(admin): users repository with role/status filter`.

---

### Task 2.5 — Medias repository

- [ ] **Step 1: Tests** `tests/lib/admin/repositories/medias.test.ts`

Test cases:
- `list()` returns 30 media (per seed)
- `list({ kind: "image" })` filters by kind
- `list({ q: "pompe" })` matches filename/caption/alt
- `create({ kind: "image", url, filename, alt, caption })` works (URL-only mock)
- `update(id, { alt: "new alt" })` works
- `remove(id)` blocks if media is used as `coverMediaId` or in `attachedMediaIds` of any article — error code `MEDIA_IN_USE`, details `{ articleIds: string[] }`
- `remove(id)` succeeds when unused

- [ ] **Step 2: Implement `src/lib/admin/repositories/medias.ts`**

```ts
export type MediaFilter = {
  q?: string;
  kind?: MediaKind | "all";
  sort?: "newest" | "oldest" | "filename" | "size";
};
```

The `create` derives `sizeBytes` to a mock value (e.g., 100_000 for images, 500_000 for PDFs) when not provided. `width`/`height` and `pageCount` accept null.

- [ ] **Step 3: Run tests**, expect green.
- [ ] **Step 4: Commit**: `feat(admin): medias repository with usage guard`.

---

### Task 2.6 — Contacts repository

- [ ] **Step 1: Tests** `tests/lib/admin/repositories/contacts.test.ts`

Test cases:
- `list()` returns 12 contacts from seed
- `list({ status: "unread" })` filters
- `list({ q: "vmc" })` matches subject/message/name/email
- `markHandled(id)` sets status="handled", handledAt=now, handledByUserId="<from arg>"
- `markArchived(id)` sets status="archived"
- `markUnread(id)` resets to unread, nulls handledAt/handledByUserId
- `remove(id)` works
- `create(input)` works (manual entry off by default but method exists for completeness)

- [ ] **Step 2: Implement `src/lib/admin/repositories/contacts.ts`**

```ts
export type ContactFilter = {
  q?: string;
  status?: ContactStatus | "all";
  sort?: "newest" | "oldest";
};

export const ContactsRepo = {
  list(filter?: ContactFilter): Promise<ContactSubmission[]>;
  get(id: ID): Promise<ContactSubmission | null>;
  create(input: Omit<ContactSubmission, "id" | "createdAt" | "handledAt" | "handledByUserId" | "status"> & { status?: ContactStatus }): Promise<ContactSubmission>;
  remove(id: ID): Promise<void>;
  markHandled(id: ID, byUserId: ID): Promise<ContactSubmission>;
  markArchived(id: ID): Promise<ContactSubmission>;
  markUnread(id: ID): Promise<ContactSubmission>;
};
```

- [ ] **Step 3: Run tests**, expect green.
- [ ] **Step 4: Commit**: `feat(admin): contacts repository with status transitions`.

---

### Task 2.7 — Articles repository

The richest entity — most fields and the broadest filter. Provide it last so all FKs (Category, Author, Media) are testable end-to-end.

- [ ] **Step 1: Tests** `tests/lib/admin/repositories/articles.test.ts`

Test cases:
- `list()` returns 20 from seed
- `list({ status: "draft" })` returns 4
- `list({ categoryId })` filters
- `list({ authorId })` filters
- `list({ q: "pompe" })` matches title/seoExcerpt
- `list({ dateFrom, dateTo })` filters by publishedAt window
- `list({ sort: "title" })` sorts alphabetically
- `list({ page: 1, pageSize: 5 })` paginates (returns first 5)
- `create({...})` works (rejects unknown `categoryId` with `CATEGORY_NOT_FOUND`, unknown `authorId` with `AUTHOR_NOT_FOUND`)
- `update(id, { status: "published" })` sets `publishedAt` if previously null
- `update(id, { status: "draft" })` from published leaves `publishedAt` alone
- `remove(id)` always works (no guard)
- `setStatus(ids[], "archived")` bulk action (used for bulk actions UI)

- [ ] **Step 2: Implement `src/lib/admin/repositories/articles.ts`**

Filter type matches spec section 5. Pagination returns `{ items, total, page, pageSize }`:

```ts
export type ArticleListResult = {
  items: Article[];
  total: number;
  page: number;
  pageSize: number;
};
```

(Update tests above to assert `result.items` length and `result.total` rather than the array directly.)

Validation on `create`/`update`: assert FK existence before commit.

- [ ] **Step 3: Run tests**, expect green.
- [ ] **Step 4: Commit**: `feat(admin): articles repository with rich filter and FK guards`.

---

### Task 2.8 — Zod validators

- [ ] **Step 1: Create `src/lib/admin/validators/category.ts`**

```ts
import { z } from "zod";
import { slugify } from "../utils";

export const CategorySchema = z.object({
  name: z.string().min(2, "Nom requis (min 2)").max(80),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/, "Slug invalide"),
  descriptionHtml: z.string().max(5000),
});

export type CategoryFormValues = z.infer<typeof CategorySchema>;

export function makeDefaultCategoryValues(): CategoryFormValues {
  return { name: "", slug: "", descriptionHtml: "" };
}

export function slugFor(name: string): string {
  return slugify(name);
}
```

- [ ] **Step 2: Create equivalents for `author.ts`, `user.ts`, `media.ts`, `contact.ts`**

Authors: name (min 2), slug, descriptionHtml (max 5000), photoUrl (nullable URL).
Users: email (z.string().email()), firstName, lastName, role (enum), status (enum).
Media: kind (enum), url (z.string().url()), filename (min 1), alt (nullable), caption (nullable).
Contact: name (min 2), email (email), subject (min 2), message (min 5).

- [ ] **Step 3: Create `src/lib/admin/validators/article.ts`**

```ts
import { z } from "zod";

export const FaqItemSchema = z.object({
  question: z.string().min(3, "Question requise"),
  answer: z.string().min(3, "Réponse requise"),
});

export const ArticleSchema = z.object({
  title: z.string().min(5, "Titre trop court").max(180),
  slug: z.string().min(3).regex(/^[a-z0-9-]+$/, "Slug invalide"),
  seoExcerpt: z.string().min(20, "Au moins 20 caractères").max(200),
  metaDescription: z.string().max(160),
  metaKeywords: z.array(z.string().min(1)).max(15),
  contentHtml: z.string().min(20, "Contenu trop court"),
  coverMediaId: z.string().nullable(),
  attachedMediaIds: z.array(z.string()),
  readingMinutes: z.number().int().min(1).max(120),
  categoryId: z.string().min(1, "Catégorie requise"),
  authorId: z.string().min(1, "Auteur requis"),
  faqs: z.array(FaqItemSchema).max(20),
  status: z.enum(["draft", "published", "archived"]),
});

export type ArticleFormValues = z.infer<typeof ArticleSchema>;
```

- [ ] **Step 4: No tests needed at this layer** (zod is library-tested).
- [ ] **Step 5: Commit**: `feat(admin): zod schemas for all entities`.

---

# Task 3 — Shell admin (layout, providers, dashboard)

**Goal:** A working `/admin` route with sidebar, topbar, command palette, dashboard KPIs. Subsequent module tasks plug into this shell.

**Files:**
- Create: `src/app/(admin)/admin/layout.tsx`, `src/app/(admin)/admin/page.tsx`
- Create: `src/components/admin/shell/{admin-shell,sidebar,topbar,command-palette,breadcrumb,page-header}.tsx`
- Create: `src/components/admin/kpi/{stat-card,recent-list}.tsx`
- Create: `src/lib/admin/query-client.ts`

---

### Task 3.1 — Query client + providers

- [ ] **Step 1: Create `src/lib/admin/query-client.ts`**

```ts
"use client";

import { QueryClient } from "@tanstack/react-query";

let client: QueryClient | null = null;

export function getQueryClient(): QueryClient {
  if (client) return client;
  client = new QueryClient({
    defaultOptions: {
      queries: { staleTime: 30_000, refetchOnWindowFocus: false, retry: 0 },
      mutations: { retry: 0 },
    },
  });
  return client;
}
```

- [ ] **Step 2: Create `src/app/(admin)/admin/layout.tsx`**

```tsx
"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { AdminShell } from "@/components/admin/shell/admin-shell";
import { getQueryClient } from "@/lib/admin/query-client";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <QueryClientProvider client={getQueryClient()}>
        <AdminShell>{children}</AdminShell>
        <Toaster position="bottom-right" richColors closeButton />
      </QueryClientProvider>
    </ThemeProvider>
  );
}
```

- [ ] **Step 3: Commit**: `feat(admin): query client and root layout providers`.

---

### Task 3.2 — AdminShell + Sidebar + Topbar

- [ ] **Step 1: Create `src/components/admin/shell/admin-shell.tsx`**

```tsx
"use client";

import * as React from "react";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Topbar onMenuClick={() => setMobileOpen(true)} />
      <div className="flex">
        <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
        <main className="flex-1 px-4 py-6 lg:px-8 lg:py-8 max-w-[1400px] mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create `src/components/admin/shell/sidebar.tsx`**

Behavior:
- Desktop: fixed `w-60`, `border-r`, sticky under topbar, scrollable.
- Mobile (`<lg`): renders inside a shadcn `Sheet`, opened via topbar hamburger.
- Items (each `next/link`): Tableau de bord (`/admin`), Catégories (`/admin/categories`), Articles (`/admin/articles`), Auteurs (`/admin/auteurs`), Utilisateurs (`/admin/utilisateurs`), Médias (`/admin/medias`), Contacts (`/admin/contacts`).
- Each item: lucide icon (LayoutDashboard, Tags, Newspaper, PenLine, Users, Image, MessageSquare) + label + optional badge count.
- Badge counts for "Articles" (drafts count) and "Contacts" (unread count) — use `useQuery` on respective list endpoints with `select` to count.
- Active link: highlight via `pathname === item.href` using `usePathname` from `next/navigation`.
- Footer of sidebar: dev `Reset` button calling `storage.reset()` then `window.location.reload()`.

Use Tailwind utilities inline. Skeleton:

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Tags, Newspaper, PenLine, Users, Image as ImageIcon, MessageSquare, RotateCcw } from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { reset } from "@/lib/admin/storage";
import { cn } from "@/lib/utils";

const ITEMS = [
  { href: "/admin", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/admin/categories", label: "Catégories", icon: Tags },
  { href: "/admin/articles", label: "Articles", icon: Newspaper, badgeKey: "drafts" as const },
  { href: "/admin/auteurs", label: "Auteurs", icon: PenLine },
  { href: "/admin/utilisateurs", label: "Utilisateurs", icon: Users },
  { href: "/admin/medias", label: "Médias", icon: ImageIcon },
  { href: "/admin/contacts", label: "Contacts", icon: MessageSquare, badgeKey: "unread" as const },
];

function NavList({ pathname, badges }: { pathname: string; badges: { drafts?: number; unread?: number } }) {
  return (
    <nav className="flex flex-col gap-1 p-3">
      {ITEMS.map((item) => {
        const Icon = item.icon;
        const active = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
        const badgeValue = item.badgeKey ? badges[item.badgeKey] : undefined;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-2 rounded-md px-3 py-2 text-sm",
              active ? "bg-secondary text-foreground font-medium" : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground",
            )}
          >
            <Icon className="size-4" />
            <span className="flex-1">{item.label}</span>
            {badgeValue ? <Badge variant="secondary" className="h-5 px-1.5 text-xs">{badgeValue}</Badge> : null}
          </Link>
        );
      })}
    </nav>
  );
}

export function Sidebar({ mobileOpen, onMobileClose }: { mobileOpen: boolean; onMobileClose: () => void }) {
  const pathname = usePathname();
  // TODO Task 3.5: useArticles/useContacts to compute badges. For now empty.
  const badges = {};

  return (
    <>
      <aside className="hidden lg:flex w-60 border-r min-h-[calc(100vh-3.5rem)] sticky top-14 flex-col">
        <NavList pathname={pathname} badges={badges} />
        <div className="mt-auto p-3 border-t">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-xs text-muted-foreground"
            onClick={() => { reset(); window.location.reload(); }}
          >
            <RotateCcw className="size-3 mr-2" /> Reset local data
          </Button>
        </div>
      </aside>
      <Sheet open={mobileOpen} onOpenChange={(v) => !v && onMobileClose()}>
        <SheetContent side="left" className="w-72 p-0">
          <NavList pathname={pathname} badges={badges} />
        </SheetContent>
      </Sheet>
    </>
  );
}
```

- [ ] **Step 3: Create `src/components/admin/shell/topbar.tsx`**

```tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CommandPalette } from "./command-palette";

export function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  const [paletteOpen, setPaletteOpen] = React.useState(false);

  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((o) => !o);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header className="sticky top-0 z-30 h-14 border-b bg-background flex items-center px-4 lg:px-6 gap-3">
      <Button variant="ghost" size="icon" className="lg:hidden" onClick={onMenuClick}>
        <Menu className="size-5" />
      </Button>
      <Link href="/admin" className="font-semibold tracking-tight">
        Maison·Calorie <span className="text-muted-foreground font-normal">/ Admin</span>
      </Link>
      <div className="flex-1" />
      <Button variant="outline" size="sm" className="gap-2 text-muted-foreground" onClick={() => setPaletteOpen(true)}>
        <Search className="size-4" />
        <span className="hidden sm:inline">Recherche…</span>
        <kbd className="ml-2 hidden sm:inline pointer-events-none rounded border bg-muted px-1.5 font-mono text-[10px]">⌘K</kbd>
      </Button>
      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />
    </header>
  );
}
```

- [ ] **Step 4: Visual verification**

Run: `npm run dev` then navigate to `http://localhost:3000/admin`.
Expected: shell renders with sidebar + topbar + empty main area. Mobile drawer opens via hamburger. No console errors.

- [ ] **Step 5: Commit**

```bash
git add src/components/admin/shell/ src/app/\(admin\)
git commit -m "feat(admin): shell with responsive sidebar and topbar"
```

---

### Task 3.3 — Command palette

- [ ] **Step 1: Create `src/components/admin/shell/command-palette.tsx`**

Minimal palette wiring cmdk + shadcn's `Command*` primitives. Categories of suggestions:
1. **Navigation** : the 7 sidebar items.
2. **Actions** : "Nouvel article" → push `/admin/articles/new`; "Nouvelle catégorie" → push `/admin/categories/new`; "Nouvel auteur" → push `/admin/auteurs/new`.
3. **Search across entities** (later wired in modules; for now placeholder hint).

```tsx
"use client";

import { useRouter } from "next/navigation";
import { Command, CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "@/components/ui/command";
import { LayoutDashboard, Tags, Newspaper, PenLine, Users, Image as ImageIcon, MessageSquare, Plus } from "lucide-react";

const NAV = [
  { href: "/admin", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/admin/categories", label: "Catégories", icon: Tags },
  { href: "/admin/articles", label: "Articles", icon: Newspaper },
  { href: "/admin/auteurs", label: "Auteurs", icon: PenLine },
  { href: "/admin/utilisateurs", label: "Utilisateurs", icon: Users },
  { href: "/admin/medias", label: "Médias", icon: ImageIcon },
  { href: "/admin/contacts", label: "Contacts", icon: MessageSquare },
];

const ACTIONS = [
  { href: "/admin/articles/new", label: "Nouvel article" },
  { href: "/admin/categories/new", label: "Nouvelle catégorie" },
  { href: "/admin/auteurs/new", label: "Nouvel auteur" },
];

export function CommandPalette({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const router = useRouter();
  const go = (href: string) => { onOpenChange(false); router.push(href); };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Rechercher ou naviguer…" />
      <CommandList>
        <CommandEmpty>Aucun résultat.</CommandEmpty>
        <CommandGroup heading="Navigation">
          {NAV.map((item) => {
            const Icon = item.icon;
            return (
              <CommandItem key={item.href} value={item.label} onSelect={() => go(item.href)}>
                <Icon className="size-4 mr-2" />
                {item.label}
              </CommandItem>
            );
          })}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Actions">
          {ACTIONS.map((a) => (
            <CommandItem key={a.href} value={a.label} onSelect={() => go(a.href)}>
              <Plus className="size-4 mr-2" />
              {a.label}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
```

- [ ] **Step 2: Visual verification**

Open `/admin`, press `⌘K`, navigate to "Nouvel article". Expected: navigates to (currently 404) `/admin/articles/new`.

- [ ] **Step 3: Commit**: `feat(admin): command palette with nav and quick actions`.

---

### Task 3.4 — Breadcrumb + PageHeader

- [ ] **Step 1: Create `src/components/admin/shell/breadcrumb.tsx`**

Receives `items: { label: string; href?: string }[]`. Renders `<nav>` with `/` separators using lucide `ChevronRight`. Last item not linked.

- [ ] **Step 2: Create `src/components/admin/shell/page-header.tsx`**

```tsx
import * as React from "react";
import { Breadcrumb } from "./breadcrumb";

export function PageHeader({
  breadcrumb,
  title,
  subtitle,
  actions,
}: {
  breadcrumb?: { label: string; href?: string }[];
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="mb-6">
      {breadcrumb ? <Breadcrumb items={breadcrumb} /> : null}
      <div className="flex items-end justify-between gap-4 mt-2">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          {subtitle ? <p className="text-sm text-muted-foreground mt-1">{subtitle}</p> : null}
        </div>
        {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Commit**: `feat(admin): breadcrumb and page header components`.

---

### Task 3.5 — Dashboard page + KPI components + sidebar badges

- [ ] **Step 1: Create `src/lib/admin/use-admin-mutation.ts`**

```ts
"use client";

import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { toast } from "sonner";

type Opts<TData, TVars> = UseMutationOptions<TData, Error, TVars> & {
  successMessage?: string | ((data: TData, vars: TVars) => string);
  errorMessage?: string | ((err: Error, vars: TVars) => string);
};

export function useAdminMutation<TData, TVars>(opts: Opts<TData, TVars>) {
  return useMutation<TData, Error, TVars>({
    ...opts,
    onSuccess: (data, vars, ctx) => {
      const msg = typeof opts.successMessage === "function" ? opts.successMessage(data, vars) : opts.successMessage;
      if (msg) toast.success(msg);
      opts.onSuccess?.(data, vars, ctx);
    },
    onError: (err, vars, ctx) => {
      const msg = typeof opts.errorMessage === "function" ? opts.errorMessage(err, vars) : opts.errorMessage ?? err.message;
      toast.error(msg);
      opts.onError?.(err, vars, ctx);
    },
  });
}
```

- [ ] **Step 2: Create base query hooks**

For each entity, create `src/lib/admin/queries/use-<entity>.ts` exposing `useXList(filter)`, `useX(id)`, `useCreateX`, `useUpdateX`, `useRemoveX`. Each invalidates the relevant `["x", "list"]` key on mutation success.

Skeleton (categories):

```ts
"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CategoriesRepo, type CategoryFilter } from "@/lib/admin/repositories/categories";
import { useAdminMutation } from "@/lib/admin/use-admin-mutation";
import type { Category, ID } from "@/lib/admin/types";

const KEY = ["admin", "categories"] as const;

export function useCategories(filter?: CategoryFilter) {
  return useQuery({ queryKey: [...KEY, "list", filter ?? {}], queryFn: () => CategoriesRepo.list(filter) });
}

export function useCategory(id: ID | undefined) {
  return useQuery({ queryKey: [...KEY, "detail", id], queryFn: () => CategoriesRepo.get(id!), enabled: !!id });
}

export function useCreateCategory() {
  const qc = useQueryClient();
  return useAdminMutation({
    mutationFn: (input: Parameters<typeof CategoriesRepo.create>[0]) => CategoriesRepo.create(input),
    successMessage: (c) => `Catégorie « ${c.name} » créée`,
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}

export function useUpdateCategory() {
  const qc = useQueryClient();
  return useAdminMutation({
    mutationFn: ({ id, patch }: { id: ID; patch: Partial<Category> }) => CategoriesRepo.update(id, patch),
    successMessage: (c) => `Catégorie « ${c.name} » mise à jour`,
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}

export function useRemoveCategory() {
  const qc = useQueryClient();
  return useAdminMutation({
    mutationFn: (id: ID) => CategoriesRepo.remove(id),
    successMessage: "Catégorie supprimée",
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}
```

Repeat for `use-articles.ts`, `use-authors.ts`, `use-users.ts`, `use-medias.ts`, `use-contacts.ts`. For contacts, also expose `useMarkHandled`, `useMarkArchived`, `useMarkUnread`. For articles, also expose `useBulkSetStatus`.

- [ ] **Step 3: Wire sidebar badges**

Update `src/components/admin/shell/sidebar.tsx`:

```tsx
import { useArticles } from "@/lib/admin/queries/use-articles";
import { useContacts } from "@/lib/admin/queries/use-contacts";

// inside Sidebar:
const drafts = useArticles({ status: "draft" });
const unread = useContacts({ status: "unread" });
const badges = {
  drafts: drafts.data?.total ?? drafts.data?.items?.length,
  unread: unread.data?.length,
};
```

(Adjust for the exact return shape; articles list returns `{ items, total, … }`.)

- [ ] **Step 4: Create KPI components**

`src/components/admin/kpi/stat-card.tsx`:

```tsx
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

export function StatCard({
  label,
  value,
  href,
  icon: Icon,
  accent,
}: {
  label: string;
  value: number | string;
  href?: string;
  icon: LucideIcon;
  accent?: "default" | "signal";
}) {
  const body = (
    <Card className={cn("hover:bg-secondary/40 transition-colors", href && "cursor-pointer")}>
      <CardContent className="p-5 flex items-center justify-between">
        <div>
          <div className="text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
          <div className="text-3xl font-semibold mt-1">{value}</div>
        </div>
        <Icon className={cn("size-8", accent === "signal" ? "text-accent" : "text-muted-foreground")} />
      </CardContent>
    </Card>
  );
  return href ? <Link href={href}>{body}</Link> : body;
}
```

`src/components/admin/kpi/recent-list.tsx`: receives `title`, `items: { id, primary, secondary, href }[]`, renders a `Card` with `CardHeader` + list of `<Link>` rows.

- [ ] **Step 5: Create `src/app/(admin)/admin/page.tsx`**

```tsx
"use client";

import { Newspaper, FileEdit, Mail, Users } from "lucide-react";
import { PageHeader } from "@/components/admin/shell/page-header";
import { StatCard } from "@/components/admin/kpi/stat-card";
import { RecentList } from "@/components/admin/kpi/recent-list";
import { useArticles } from "@/lib/admin/queries/use-articles";
import { useContacts } from "@/lib/admin/queries/use-contacts";
import { useUsers } from "@/lib/admin/queries/use-users";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function AdminDashboardPage() {
  const published = useArticles({ status: "published" });
  const drafts = useArticles({ status: "draft" });
  const unread = useContacts({ status: "unread" });
  // last 7d users computed client-side
  const allUsers = useUsers();
  const recent = useArticles({ sort: "newest", pageSize: 5 });
  const recentContacts = useContacts({ status: "unread", sort: "newest" });

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const newUsers = (allUsers.data ?? []).filter((u) => u.createdAt >= sevenDaysAgo).length;

  return (
    <>
      <PageHeader title="Tableau de bord" subtitle="Aperçu de l'éditorial et de la boîte de réception" />
      <Alert className="mb-6">
        <AlertDescription className="text-xs">
          Données locales (localStorage). L'auth Kinde et l'API seront branchées plus tard.
        </AlertDescription>
      </Alert>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Articles publiés" value={published.data?.total ?? 0} href="/admin/articles?status=published" icon={Newspaper} />
        <StatCard label="Brouillons" value={drafts.data?.total ?? 0} href="/admin/articles?status=draft" icon={FileEdit} />
        <StatCard label="Messages non lus" value={unread.data?.length ?? 0} href="/admin/contacts?status=unread" icon={Mail} accent="signal" />
        <StatCard label="Nouveaux utilisateurs (7j)" value={newUsers} href="/admin/utilisateurs" icon={Users} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <RecentList
          title="Derniers articles"
          items={(recent.data?.items ?? []).map((a) => ({
            id: a.id,
            primary: a.title,
            secondary: a.status,
            href: `/admin/articles/${a.id}`,
          }))}
        />
        <RecentList
          title="Derniers messages non lus"
          items={(recentContacts.data ?? []).slice(0, 5).map((c) => ({
            id: c.id,
            primary: c.subject,
            secondary: `${c.name} — ${c.email}`,
            href: `/admin/contacts/${c.id}`,
          }))}
        />
      </div>
    </>
  );
}
```

- [ ] **Step 6: Visual verification**

Run: `npm run dev`, open `/admin`. Expected: 4 KPI cards with non-zero values, two recent lists, info alert. Click "Articles publiés" → navigates to `/admin/articles?status=published` (404 until Task 5/6).

- [ ] **Step 7: Commit**

```bash
git add src/lib/admin/queries src/lib/admin/use-admin-mutation.ts src/components/admin/kpi src/app/\(admin\)/admin/page.tsx src/components/admin/shell/sidebar.tsx
git commit -m "feat(admin): dashboard KPIs, query hooks, sidebar badges"
```

---

# Task 4 — Shared data components

**Goal:** Generic DataTable + filter toolbar + pagination + bulk actions + feedback primitives. Reused by all 6 modules.

**Files:**
- Create: `src/components/admin/data/*.tsx`, `src/components/admin/feedback/*.tsx`, `src/lib/admin/use-table-filters.ts`

---

### Task 4.1 — `useTableFilters` hook (URL ↔ state)

- [ ] **Step 1: Create `src/lib/admin/use-table-filters.ts`**

A type-safe wrapper around `useSearchParams` + `useRouter`. Generic over a filter shape. Reads from URL on mount, writes on change (replace, not push).

```ts
"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useMemo } from "react";

export function useTableFilters<T extends Record<string, string | number | undefined>>(defaults: T) {
  const router = useRouter();
  const pathname = usePathname();
  const search = useSearchParams();

  const filters = useMemo(() => {
    const out: Record<string, string | number | undefined> = {};
    for (const key of Object.keys(defaults)) {
      const raw = search.get(key);
      const def = defaults[key];
      if (raw === null) out[key] = def;
      else if (typeof def === "number") out[key] = Number.isFinite(Number(raw)) ? Number(raw) : def;
      else out[key] = raw;
    }
    return out as T;
  }, [defaults, search]);

  const setFilters = useCallback((patch: Partial<T>) => {
    const params = new URLSearchParams(search.toString());
    for (const [k, v] of Object.entries(patch)) {
      if (v === undefined || v === "" || v === defaults[k]) params.delete(k);
      else params.set(k, String(v));
    }
    router.replace(`${pathname}?${params.toString()}`);
  }, [defaults, pathname, router, search]);

  const reset = useCallback(() => {
    router.replace(pathname);
  }, [pathname, router]);

  return { filters, setFilters, reset };
}
```

- [ ] **Step 2: Commit**: `feat(admin): useTableFilters hook (URL sync)`.

---

### Task 4.2 — DataTable, toolbar, pagination, column header, row actions

- [ ] **Step 1: Create `src/components/admin/data/data-table.tsx`**

Generic table wrapping `useReactTable` + shadcn `Table`. Props:

```ts
type DataTableProps<TData> = {
  data: TData[];
  columns: ColumnDef<TData>[];
  isLoading?: boolean;
  emptyState?: React.ReactNode;
  onRowClick?: (row: TData) => void;
};
```

Skeleton loading: render 5 skeleton rows when `isLoading`. Empty state: render `emptyState` when `data.length === 0 && !isLoading`. Each row: `<TableRow>` with `<TableCell>` per column. If `onRowClick`, set `cursor-pointer` + click handler (but ignore clicks on cells containing buttons/checkboxes — use `event.target` heuristic or per-column `meta`).

- [ ] **Step 2: Create `src/components/admin/data/column-header.tsx`**

Helper to render a sortable column header. Renders label + chevron icon based on sort state. Accepts `column` from tanstack and an `onClick` that toggles sort direction.

- [ ] **Step 3: Create `src/components/admin/data/row-actions.tsx`**

DropdownMenu trigger (lucide `MoreHorizontal`) with provided items. Items shape: `{ label, onClick, destructive?, icon? }[]`. Confirmation for destructive routed through `ConfirmDialog` (Task 4.4).

- [ ] **Step 4: Create `src/components/admin/data/data-table-toolbar.tsx`**

Renders a row above the table containing slots: search input, filter selects (provided as children), and a "Reset" button if any filter ≠ default.

- [ ] **Step 5: Create `src/components/admin/data/data-table-pagination.tsx`**

Page number, total, "Précédent" / "Suivant" buttons. Receives `page`, `pageSize`, `total`, `onPageChange`.

- [ ] **Step 6: Create `src/components/admin/data/bulk-actions-bar.tsx`**

Sticky bar at bottom of viewport (`fixed bottom-4 left-1/2 -translate-x-1/2`) rendered conditionally when `selectedCount > 0`. Shows count + provided action buttons.

- [ ] **Step 7: Commit**: `feat(admin): data table, toolbar, pagination, row-actions, bulk-actions`.

---

### Task 4.3 — Feedback primitives

- [ ] **Step 1: Create `src/components/admin/feedback/status-badge.tsx`**

Variants based on string status: `published → green`, `draft → muted`, `archived → outline`. For contacts: `unread → blue`, `handled → green`, `archived → outline`. For users: `active → green`, `suspended → red`.

```tsx
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const VARIANTS: Record<string, string> = {
  published: "bg-green-100 text-green-900 border-green-300",
  draft: "bg-muted text-muted-foreground border-transparent",
  archived: "bg-secondary text-muted-foreground border-border",
  unread: "bg-blue-100 text-blue-900 border-blue-300",
  handled: "bg-green-100 text-green-900 border-green-300",
  active: "bg-green-100 text-green-900 border-green-300",
  suspended: "bg-red-100 text-red-900 border-red-300",
};

const LABELS: Record<string, string> = {
  published: "Publié",
  draft: "Brouillon",
  archived: "Archivé",
  unread: "Non lu",
  handled: "Traité",
  active: "Actif",
  suspended: "Suspendu",
};

export function StatusBadge({ status }: { status: string }) {
  return <Badge className={cn("border", VARIANTS[status])}>{LABELS[status] ?? status}</Badge>;
}
```

- [ ] **Step 2: Create `src/components/admin/feedback/empty-state.tsx`**

Centered icon (lucide), title, subtitle, optional CTA button. Use it when a list is empty.

- [ ] **Step 3: Create `src/components/admin/feedback/confirm-dialog.tsx`**

Generic confirmation dialog with optional "type to confirm" input. Props:

```ts
type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: React.ReactNode;
  confirmLabel?: string;          // default "Supprimer"
  confirmVariant?: "destructive" | "default";
  typeToConfirm?: string;         // if provided, user must type this to enable confirm
  onConfirm: () => void | Promise<void>;
};
```

Uses shadcn `Dialog`, `Input`, `Button`. Disable confirm until typed value matches `typeToConfirm` (case-sensitive).

- [ ] **Step 4: Commit**: `feat(admin): feedback primitives (status badge, empty state, confirm dialog)`.

---

# Tasks 5.A–5.D — Simple modules (PARALLELIZABLE)

These four tasks are independent and can be dispatched to four `coder` subagents in parallel. Each follows the same pattern: list page + form pages + integration with shared components.

**Common pattern per module:**
1. List page: PageHeader + DataTableToolbar + DataTable + (Pagination if needed) + (BulkActionsBar if applicable).
2. Form pages (`new`, `[slug|id]`): form with react-hook-form + zod resolver, calls `useCreate*` / `useUpdate*`, redirects on success.
3. Delete confirmation via ConfirmDialog; show repository error guards.

---

### Task 5.A — Categories module

**Files:** `src/app/(admin)/admin/categories/{page,new/page,[slug]/page}.tsx`

- [ ] **Step 1: List page `categories/page.tsx`**

Columns: Nom (link to edit) · Slug (mono font) · Articles (badge with count) · Mise à jour (relative time via `date-fns/formatDistanceToNow`) · Actions (RowActions).

Toolbar: search input bound to `filters.q`, "Reset" if any filter set.

Row actions: Éditer (push `/admin/categories/[slug]`), Supprimer (ConfirmDialog typed with category name).

Delete error handling: if `RepositoryError.code === "CATEGORY_HAS_ARTICLES"`, show dialog "Cette catégorie contient N articles. [Voir ces articles](/admin/articles?categoryId=…)".

Page header action: `<Button asChild><Link href="/admin/categories/new">+ Nouvelle catégorie</Link></Button>`.

- [ ] **Step 2: Create form `categories/new/page.tsx` and edit form `categories/[slug]/page.tsx`**

Both reuse a shared `<CategoryForm initial={…} onSubmit={…} />` component placed at `src/components/admin/forms/category-form.tsx`.

Form fields:
- Name (Input, autofocus). On blur or change, if slug is untouched, auto-populate via `slugify(name)`.
- Slug (SlugInput — see Task 6.1.1 for the shared component; for now inline Input with manual edit).
- Description HTML (RichTextEditor — minimal Tiptap, see Task 6.3 for the shared component; for now use a `Textarea` placeholder that takes HTML).

Wire `react-hook-form` + `zodResolver(CategorySchema)`. On submit: call `useCreateCategory` or `useUpdateCategory`, on success router.push back to `/admin/categories`, on error display `RepositoryError` message inline.

**Note**: The category form uses a richtext editor for descriptionHtml. Until Task 6.4 ships the `RichTextEditor` component, render a `Textarea` with a label "HTML autorisé" — this is acceptable interim. The form spec stays the same.

- [ ] **Step 3: Visual verification**

`npm run dev`. At `/admin/categories`: see 8 categories. Create, edit, delete. Verify delete is blocked on a referenced category and the "Voir ces articles" link works (404 until Task 6 ships articles list, that's fine).

- [ ] **Step 4: Commit**: `feat(admin): categories module (list, create, edit, delete with guards)`.

---

### Task 5.B — Authors module

**Files:** `src/app/(admin)/admin/auteurs/{page,new/page,[slug]/page}.tsx`, `src/components/admin/forms/author-form.tsx`

- [ ] **Step 1: List page**

**Grid layout (not table)** per spec section 9.4: 3 cols desktop / 2 sm / 1 mobile. Each card: avatar (or initials) · name (link to edit) · slug (mono, muted) · articleCount badge. Action menu in top-right of card.

Toolbar: search by name/slug.

Delete: same `AUTHOR_HAS_ARTICLES` pattern.

- [ ] **Step 2: Form pages**

Fields:
- Photo URL (Input + thumbnail preview if URL valid)
- Name (Input, auto-suggests slug)
- Slug (Input)
- Description HTML (RichTextEditor or Textarea interim)

- [ ] **Step 3: Visual verification + commit**: `feat(admin): authors module (grid view, CRUD with guards)`.

---

### Task 5.C — Users module

**Files:** `src/app/(admin)/admin/utilisateurs/{page,new/page,[id]/page}.tsx`, `src/components/admin/forms/user-form.tsx`

- [ ] **Step 1: List page (table)**

Columns: ☐ (checkbox) · Avatar+Nom (initials fallback) · Email · Rôle (StatusBadge) · Statut (StatusBadge) · Dernière connexion (relative time, "Jamais" if null) · Créé le.

Toolbar: search · Role select (Tous / admin / editor / reader) · Status select (Tous / Actif / Suspendu) · Reset.

Row actions: Éditer · Suspendre/Réactiver (inline toggle via `useUpdateUser`) · Supprimer (ConfirmDialog typed with email).

Info banner at top: "Ces données seront synchronisées avec Kinde lors du branchement de l'authentification."

- [ ] **Step 2: Form pages**

Fields: Email · First name · Last name · Role (Select) · Status (Switch labeled "Compte actif").

Email duplicate handling: catch `RepositoryError.code === "EMAIL_TAKEN"` on submit.

- [ ] **Step 3: Visual verification + commit**: `feat(admin): users module with role/status filters`.

---

### Task 5.D — Contacts module

**Files:** `src/app/(admin)/admin/contacts/{page,[id]/page}.tsx`

- [ ] **Step 1: Inbox list page**

Tabs (shadcn `Tabs`): Non lus · Traités · Archivés. Each tab loads the corresponding `useContacts({ status })` query.

Below the tabs, table:
- Columns: ☐ · point colored by status · Nom+email (stacked) · Sujet (bold if unread) · Aperçu message (truncated to ~80 chars) · Date (relative).
- Row click navigates to `/admin/contacts/[id]`.
- Toolbar: search · Reset.

Bulk actions bar: Marquer traités · Archiver · Supprimer (on selection).

- [ ] **Step 2: Detail page `[id]/page.tsx`**

Layout: 2 columns (grid on lg, stack on mobile).
- Left: subject as h1, message rendered as `<pre className="whitespace-pre-wrap font-sans">{message}</pre>`, metadata block (name, email, date, status badge).
- Right: vertical action buttons: Marquer traité (or Marquer non lu if already handled) · Archiver · Supprimer · Copier l'email (clipboard) · Ouvrir mailto:.

On entering detail: do NOT auto-mark handled (per spec).

- [ ] **Step 3: Visual verification + commit**: `feat(admin): contacts inbox and detail view`.

---

# Task 6 — Articles module

**Goal:** The flagship module — rich list filters, bulk actions, complex form with Tiptap editor, FAQ editor, relation pickers, media picker, SEO fields.

**Files:** `src/app/(admin)/admin/articles/{page,new/page,[id]/page}.tsx`, `src/components/admin/forms/{form-section,slug-input,keywords-input,status-select,reading-time-input,faq-editor,media-picker,relation-picker,rich-text-editor,article-form}.tsx`

---

### Task 6.1 — Form primitives

- [ ] **Step 1: `form-section.tsx`** — `<section>` with title, optional description, slot for content. Used to group fields in the form.
- [ ] **Step 2: `slug-input.tsx`** — Input pre-filled by slugifying a `source` prop (e.g., title). User can manually edit, after which auto-sync is disabled (tracked with an internal `manuallyEdited` ref). Calls `onChange(slug)`. Shows a small "Régénérer depuis le titre" link.
- [ ] **Step 3: `keywords-input.tsx`** — Renders chips for current keywords + an input. Enter adds, Backspace on empty deletes last. Comma also adds. Max length per chip enforced via zod.
- [ ] **Step 4: `status-select.tsx`** — shadcn Select with 3 options + colored dot for current selection.
- [ ] **Step 5: `reading-time-input.tsx`** — number Input + "Calculer" button that takes `htmlSource` prop and applies `readingMinutesFromHtml`. Calls `onChange(minutes)`.
- [ ] **Step 6: Commit**: `feat(admin): article form primitives (slug, keywords, status, reading time)`.

---

### Task 6.2 — FAQ editor + relation picker

- [ ] **Step 1: `faq-editor.tsx`**

Props: `value: FaqItem[]`, `onChange: (next: FaqItem[]) => void`. Renders a list of accordions (use shadcn `Accordion`) each showing Question + Answer (Textareas). Buttons: Ajouter une question (appends `{ question: "", answer: "" }`), Supprimer (per item). Reorder via up/down chevrons (drag handles optional — skip drag for now). Empty state: "Aucune FAQ. Cliquez pour en ajouter."

- [ ] **Step 2: `relation-picker.tsx`**

Generic Combobox (cmdk popover) for selecting a single FK. Props:

```ts
type Props<T extends { id: string }> = {
  value: string | null;
  options: T[];
  isLoading?: boolean;
  getLabel: (item: T) => string;
  getSubLabel?: (item: T) => string;
  renderTrigger?: (selected: T | null) => React.ReactNode;
  onChange: (id: string | null) => void;
  placeholder?: string;
  emptyMessage?: string;
};
```

Used for Category (label only) and Author (label + avatar via `renderTrigger`).

- [ ] **Step 3: Commit**: `feat(admin): faq editor and generic relation picker`.

---

### Task 6.3 — Media picker

- [ ] **Step 1: `media-picker.tsx`**

Two modes via `mode` prop: `"single"` (cover) or `"multi"` (attached). Trigger is either a thumbnail+name or a "Sélectionner" button. Opens a shadcn `Dialog` containing:
- Search input (filters by filename/alt).
- Tabs: Images / PDF / Tous.
- Grid of media cards (4 cols). Click to select. In multi mode, checkbox per card and selection accumulator. Confirm button writes selection to the field.

Selection state: controlled. `value: string | null` (single) or `value: string[]` (multi). Uses `useMedias({ kind })` query.

- [ ] **Step 2: Commit**: `feat(admin): media picker (single/multi modes)`.

---

### Task 6.4 — Rich text editor (Tiptap)

- [ ] **Step 1: `rich-text-editor.tsx`**

`"use client"` component using `@tiptap/react`. Lazy-load by exporting via `next/dynamic` from a wrapper file: `rich-text-editor.client.tsx` contains the real implementation, `rich-text-editor.tsx` is the dynamic-imported re-export with `ssr: false`. This keeps it out of the server bundle.

Toolbar buttons: Bold · Italic · H2 · H3 · UL · OL · Quote · Link (prompt) · Image (open media picker → insert `<img src>`) · Table · Undo / Redo. Each button uses lucide icons and toggles via `editor.chain().focus()…run()`.

Controls editor state via `useEditor({ extensions, content: value, onUpdate: ({ editor }) => onChange(editor.getHTML()) })`. Use extensions: `StarterKit`, `Link.configure({ openOnClick: false })`, `Image`, `Table.configure({ resizable: false })`, `TableRow`, `TableCell`, `TableHeader`.

Styling: wrap output in `prose prose-sm max-w-none focus:outline-none min-h-[400px] p-4`. Use shadcn's `border rounded-md` wrapper.

- [ ] **Step 2: Commit**: `feat(admin): tiptap rich text editor with media insert and table support`.

---

### Task 6.5 — Articles list page

- [ ] **Step 1: List page `articles/page.tsx`**

Columns: ☐ · Title + seoExcerpt (2 lines, excerpt smaller muted) · Category (Badge linking to `?categoryId=`) · Author (avatar+name) · Status (StatusBadge) · Publié le (relative or "—") · Actions.

Toolbar:
- Search input → `q`
- Status select (Tous / Brouillon / Publié / Archivé)
- Category select (loaded from `useCategories`)
- Author select (loaded from `useAuthors`)
- Date range (use shadcn `Popover` + two date inputs — simple `<Input type="date">` is acceptable)
- Reset

Bulk actions: Publier · Archiver · Réassigner catégorie (opens dialog with category select) · Supprimer.

Row actions: Voir (opens preview Sheet) · Éditer · Dupliquer (creates copy with `(copie)` suffix and `draft` status via repo `create` with copied fields) · Changer statut (submenu) · Supprimer.

Pagination via `useArticles({ ..., page, pageSize: 20 })` (returns `{ items, total }`).

- [ ] **Step 2: Commit**: `feat(admin): articles list with rich filters and bulk actions`.

---

### Task 6.6 — Articles form

- [ ] **Step 1: `article-form.tsx`**

Two-column layout per spec section 8 ("Formulaire Article (le plus riche)").

Main column (`<form>` with `react-hook-form`):
1. `FormSection` "Contenu"
   - Title (Input, large)
   - SlugInput (source=title)
   - SEO excerpt (Textarea, max 200, counter "X/160")
   - RichTextEditor for `contentHtml`
2. `FormSection` "FAQ"
   - FaqEditor

Sidebar (sticky `lg:sticky lg:top-20`):
1. `FormSection` "Publication"
   - StatusSelect
   - publishedAt (read-only, formatted)
   - Two buttons: "Enregistrer brouillon" / "Publier" (sets status accordingly)
2. `FormSection` "Catégorie"
   - RelationPicker over categories
3. `FormSection` "Auteur"
   - RelationPicker over authors (renderTrigger shows avatar)
4. `FormSection` "Médias"
   - MediaPicker single for cover
   - MediaPicker multi for attached
5. `FormSection` "Temps de lecture"
   - ReadingTimeInput (source=contentHtml)
6. `FormSection` "SEO"
   - metaDescription (Textarea, counter "X/160")
   - KeywordsInput

Sticky bottom action bar on mobile: Annuler · Aperçu · Enregistrer · Publier.

Preview button: opens shadcn `Sheet` (side="right", w-full max-w-3xl) rendering `<div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: contentHtml }} />` plus title and meta info above. Reuses the public `.prose` styles already in `globals.css`.

- [ ] **Step 2: Pages `new/page.tsx` and `[id]/page.tsx`**

`new`: render `<ArticleForm mode="create" />`.
`[id]`: load via `useArticle(params.id)`, render `<ArticleForm mode="edit" initial={data} />`.

- [ ] **Step 3: Visual verification**

Critical end-to-end check:
1. Create an article from scratch: title → slug auto → cover via MediaPicker → category + author pickers → content via Tiptap with image insert → 2 FAQs → Publish.
2. Verify it appears in `/admin/articles`, in `/admin` dashboard (recent + count), with correct status badge.
3. Edit and change status to archived. Verify filter `status=archived` shows it.

- [ ] **Step 4: Commit**: `feat(admin): articles form with tiptap, faq, pickers, preview`.

---

# Task 7 — Media module

**Goal:** Visual gallery of medias with filter, detail sheet, disabled-upload dialog with URL-import fallback.

**Files:** `src/app/(admin)/admin/medias/page.tsx`, `src/components/admin/media/{media-card,media-detail-sheet,add-media-dialog}.tsx`

---

### Task 7.1 — Grid and detail sheet

- [ ] **Step 1: `media-card.tsx`**

`Card` with 16:9 thumbnail (for images: `<img src={url} className="object-cover" />`; for PDF: large `FileText` icon over a gray background + `PDF` badge). Below: filename (truncated, mono small), kind+size meta line. Hover: subtle border highlight + cursor pointer.

- [ ] **Step 2: `media-detail-sheet.tsx`**

Shadcn `Sheet` (side="right", w-full max-w-md). Content:
- Large preview (image full-width, PDF iframe `<iframe src={url} className="w-full h-96" />`)
- Editable fields: alt, caption (Textareas, save on blur via `useUpdateMedia`)
- Read-only metadata: filename, kind, size, dimensions or pageCount, createdAt
- Actions: "Copier l'URL" (clipboard, toast confirm), "Supprimer" (ConfirmDialog with usage check)

Delete error: catch `MEDIA_IN_USE` and show a dialog listing affected article titles (resolve via local cache of articles to map ids→titles).

- [ ] **Step 3: List page `medias/page.tsx`**

Toolbar: search · Type select (Tous / Images / PDF) · Sort select (Récent / Nom / Taille). "+ Ajouter un média" button opens add dialog (Task 7.2).

Grid of `MediaCard` (4 cols lg, 3 md, 2 sm, 1 xs). Clicking a card opens the detail sheet with that media selected.

- [ ] **Step 4: Commit**: `feat(admin): media grid and detail sheet (read/edit/delete)`.

---

### Task 7.2 — Add media dialog (URL import only)

- [ ] **Step 1: `add-media-dialog.tsx`**

Tabs:
1. **Upload** (disabled): large dashed drag zone with "Upload R2 — bientôt disponible" message and a `disabled` button.
2. **URL externe** (functional): form with kind select (image/pdf), url (Input), filename (Input — auto-derived from URL pathname, editable), alt (Input, images only), caption (Input). On submit: call `useCreateMedia`. For images, attempt to read dimensions by creating an `Image` and reading `naturalWidth/Height` (best-effort; null on failure). For PDFs, set `pageCount: null`. `sizeBytes` set to 0 (unknown).

Info alert at top of dialog: "L'upload de fichiers sera branché sur Cloudflare R2."

- [ ] **Step 2: Visual verification**

Add a media by URL (e.g., random Unsplash). Confirm card appears in grid. Open detail sheet. Edit alt. Delete it. Try deleting a media used as a cover → expect error dialog listing the article.

- [ ] **Step 3: Commit**: `feat(admin): add-media dialog with URL import (R2 upload disabled)`.

---

# Final acceptance

Manual end-to-end run on the dev server:

1. `npm run dev`, open `http://localhost:3000/admin`.
2. **Dashboard**: 4 KPIs non-zero, both recent lists populated, info banner visible.
3. **Categories**: list 8, create new, edit, attempt delete on Isolation → blocked dialog with link.
4. **Articles**: list 20, filter by status, by category, by author, search, paginate. Bulk archive 2 articles. Duplicate an article. Open one in edit, modify content, preview, publish.
5. **Authors**: 6 cards, create, edit, delete with guard.
6. **Users**: 5 rows, filter by role/status, suspend one inline, edit, delete with email-typed confirmation.
7. **Media**: 30 items, filter Images / PDF, open detail sheet, edit alt, copy URL, delete unused. Add via URL.
8. **Contacts**: 12 entries across tabs, click row → detail, mark handled, archive, delete.
9. **⌘K** palette: navigate via search.
10. **Reload page**: state persists.
11. **Reset local data**: returns to seed.
12. **Toggle theme**: light/dark both readable (manual scan).
13. **Public site untouched**: `/`, `/article/[id]`, `/rubriques/[slug]` still render exactly as before.
14. `npm run build` succeeds.
15. `npm run lint` passes.
16. `npm test` — all unit tests pass.

Run final verification:

```bash
npm run lint && npm test && npm run build
```

Expected: all three green.

Commit final tag (optional):

```bash
git tag admin-dashboard-v1
```

---

## Out-of-scope reminders (do NOT implement)

- ❌ Kinde auth, scope checks, route guards. The `/admin` route is publicly reachable for now.
- ❌ Real upload to Cloudflare R2.
- ❌ Sending emails for contact replies.
- ❌ Migrating public pages to read from `lib/admin/seed.ts`. They continue reading `lib/data.ts`.

---

## Risk callouts during implementation

- **Bundle size**: confirm post-build that the admin route group's first-load JS stays under ~400 KB. If Tiptap drags more than expected, verify the lazy import in Task 6.4 is effective (`/_next/static/chunks/article-form-*.js` should be split).
- **Hydration**: every admin file under `(admin)/admin/` is `"use client"` either explicitly or transitively (because layout is client). Server-only sections do not exist here.
- **localStorage SSR**: `storage.load()` is gated by `typeof window === "undefined"` and called only from client hooks. Repositories must never be imported from server components.
- **Dark mode**: at the end of Task 1.3, do a quick `/admin` toggle test — adjust HSL values if any badge becomes unreadable.
- **Slug collisions on duplicate** (Task 6.5): when duplicating an article, generate slug `${original}-copie-${shortId}` to avoid `SLUG_TAKEN`.
