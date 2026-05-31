# Contact form — public submission flow

**Status:** approved, ready for implementation plan
**Date:** 2026-05-31

## Goal

Transformer la page `/contact` (actuellement un mockup statique avec valeurs préremplies) en formulaire fonctionnel. Soumission via endpoint public `/api/contact`, persistance dans la table `contacts` existante, gestion des erreurs et confirmation UX. React Hook Form + Zod côté client, React Query pour la mutation, validation server-side stricte, rate-limit minimal.

## Scope

### In
- Migration Drizzle ajoutant une colonne `reason` enum à `contacts`.
- Endpoint public `POST /api/contact` avec validation Zod + rate-limit IP en mémoire.
- Refactor de `/contact/page.tsx` : extraction d'un client component `<ContactForm />`.
- Composant `<ContactSuccess />` qui remplace le formulaire après succès.
- Schéma Zod partagé entre client et serveur (`src/lib/contact/schema.ts`).
- Tests Vitest sur le repo + le rate-limiter ; tests Playwright e2e du flow.

### Out
- Notification e-mail à l'équipe (admin browse via `/admin/contacts`).
- Captcha / Cloudflare Turnstile (rate-limit suffit pour V1, à upgrader plus tard).
- Stockage de l'IP / User-Agent côté serveur (pas besoin RGPD pour V1).
- Modération automatique du contenu.
- Notification au visiteur (auto-reply).

## Data model

Nouvelle migration Drizzle :

```ts
// src/lib/db/schema.ts
export const contactReason = pgEnum("contact_reason", [
  "article",  // Une question sur un article
  "error",    // Signaler une erreur
  "qcm",      // Une question sur un QCM
  "other",    // Autre demande
]);

export const contacts = pgTable("contacts", {
  // ... champs existants
  reason: contactReason("reason").notNull(),  // nouvelle colonne
});
```

Migration `drizzle-kit generate` produira un fichier SQL avec :
1. `CREATE TYPE contact_reason AS ENUM (...)`
2. `ALTER TABLE contacts ADD COLUMN reason contact_reason NOT NULL DEFAULT 'other'`
3. Suivi d'un `ALTER COLUMN ... DROP DEFAULT` (la valeur par défaut n'a de sens que pour le backfill des lignes existantes).

Les labels français (`"Une question sur un article"`, etc.) vivent côté front dans un map `reasonLabels` partagé entre `ContactForm` et l'admin.

## API contract

**Route :** `POST /api/contact`
**Handler :** `src/app/api/contact/route.ts` (App Router, runtime Node)

### Request body

```json
{
  "name": "Mathieu Renaud",
  "email": "m.renaud@exemple.fr",
  "reason": "article",
  "subject": "Question sur le décret PAC",
  "message": "Bonjour, ...",
  "consent": true
}
```

### Zod schema (partagé `src/lib/contact/schema.ts`)

```ts
export const contactReasonSchema = z.enum(["article", "error", "qcm", "other"]);

export const contactSubmissionSchema = z.object({
  name: z.string().trim().min(2, "Nom trop court").max(80, "Nom trop long"),
  email: z.string().trim().email("E-mail invalide").max(120),
  reason: contactReasonSchema,
  subject: z.string().trim().min(3, "Sujet trop court").max(140, "Sujet trop long"),
  message: z.string().trim().min(10, "Message trop court").max(4000, "Message trop long"),
  consent: z.literal(true, { errorMap: () => ({ message: "Consentement requis" }) }),
});

export type ContactSubmission = z.infer<typeof contactSubmissionSchema>;
```

### Rate-limit

- **Implémentation :** `Map<string, { count: number; windowStart: number }>` au niveau module dans `src/lib/contact/rate-limit.ts`.
- **Fenêtre :** 10 minutes glissantes.
- **Quota :** 5 soumissions max par IP par fenêtre.
- **Lecture IP :** `request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()` avec fallback `x-real-ip` puis `"unknown"`.
- **Garbage collection :** au début de chaque check, on supprime les entrées dont `windowStart + 10min < now`. Tient en mémoire raisonnable même sans cron.
- **Caveat critique :** la Map en mémoire **ne fonctionne que pour un runtime long-vivant** (Node self-hosted, Docker, Fly.io, Railway). Sur Vercel / Cloudflare Workers / déploiements serverless, chaque invocation peut atterrir sur un container différent et la Map est effectivement vide à chaque appel — le rate-limit serait inopérant. **Si le déploiement cible est serverless, V1 doit basculer sur Upstash Redis dès le départ** (10 lignes de plus, plan gratuit suffisant). À confirmer avec le déploiement choisi pendant l'implémentation.

### Responses

| Status | Body | Quand |
|--------|------|-------|
| `201 Created` | `{ id: string }` | Insert réussi |
| `400 Bad Request` | `{ code: "VALIDATION", fieldErrors: Record<string, string[]>, formErrors: string[] }` | Zod parse fail (shape de `z.flattenError()`) |
| `429 Too Many Requests` | `{ code: "RATE_LIMITED", retryAfterSeconds: number }` + header `Retry-After` | Quota dépassé |
| `500 Internal Server Error` | `{ code: "INTERNAL" }` | Repo crash, log côté serveur |

Pas de CSRF token : endpoint public sans auth, sans état utilisateur, le seul effet de bord est l'insertion d'une ligne dans `contacts` (modérable côté admin).

## Form component

**Fichier :** `src/app/contact/contact-form.tsx` (`"use client"`)

### Stack

- `useForm<ContactSubmission>({ resolver: zodResolver(contactSubmissionSchema) })`
- `useMutation` autour d'un `fetch("/api/contact", { method: "POST", ... })`. Suit le pattern de `useAdminMutation` mais sans la dépendance `sonner` toast (succès = remplacement du form, pas de toast).
- État local `submitted: boolean` ou via la donnée `mutation.isSuccess` pour switcher entre `<form>` et `<ContactSuccess />`.

### Mapping mockup → fields

| Champ mockup | RHF field | Validation |
|---|---|---|
| `defaultValue="Mathieu Renaud"` | `register("name")` (no default) | min 2 / max 80 |
| `defaultValue="m.renaud@exemple.fr"` | `register("email")` | email + max 120 |
| `<input type="radio" name="reason">` | `register("reason")` | enum |
| `defaultValue="Question sur le décret PAC..."` | `register("subject")` | min 3 / max 140 |
| `defaultValue="Bonjour, ..."` | `register("message")` | min 10 / max 4000 |
| `defaultChecked` consent | `register("consent")` **non pré-coché** | literal(true) |

Le compteur live du textarea : `const messageLength = watch("message")?.length ?? 0;` puis `<span>{messageLength} / 4000</span>`.

### Gestion des erreurs serveur

```ts
const onSubmit = form.handleSubmit(async (values) => {
  try {
    await mutation.mutateAsync(values);
  } catch (err) {
    if (err instanceof RepositoryError && err.code === "VALIDATION") {
      // re-injecter les erreurs sur les champs
      Object.entries(err.details.fieldErrors).forEach(([field, messages]) => {
        form.setError(field as keyof ContactSubmission, { message: messages[0] });
      });
    } else if (err instanceof RepositoryError && err.code === "RATE_LIMITED") {
      setBannerError(`Trop de tentatives. Réessayez dans ${err.details.retryAfterSeconds}s.`);
    } else {
      setBannerError("Une erreur est survenue. Réessayez ou écrivez-nous directement à redac@maison-calorie.fr.");
    }
  }
});
```

### Réutilisation existante

- Pas de re-création des classes admin (`abtn`, `adm-*`) — ce sont des classes du dashboard. Le formulaire public utilise les classes du design system éditorial : `.btn`, `.field`, etc.
- Le mockup actuel utilise déjà ces classes — conserver le markup, juste brancher RHF + retirer les `defaultValue` / `defaultChecked`.

## UX flow

### Idle → submitting

- Bouton `type="submit"` désactivé pendant `mutation.isPending`, libellé "Envoi en cours…".
- Bouton "Annuler" : reset du form via `form.reset()`. Pas d'autre effet.

### Success

- Le `<form>` est démonté, remplacé par `<ContactSuccess onReset={() => setSubmitted(false)} />` dans le même container border-ink.
- Contenu de `ContactSuccess` : titre "Message envoyé", paragraphe "Merci, l'équipe lit tout et répond sous 48h en jours ouvrés.", bouton "Envoyer un autre message" qui appelle `form.reset()` + remet l'état à `idle`.
- L'URL reste `/contact` (pas de redirect). Bénéfice SEO + simplicité.

### Validation errors (400)

- Erreurs Zod côté client : RHF affiche les messages sous chaque champ automatiquement (via `formState.errors`).
- Erreurs Zod côté serveur (cas où le client est contourné) : `setError` re-injecte sur les champs.

### Rate-limit (429)

- Bandeau d'erreur global affiché au-dessus du formulaire, avec le countdown depuis `retryAfterSeconds`.
- Pas de countdown live (`setTimeout`) — simple message statique, l'utilisateur recharge la page si besoin.

### Network / 500

- Bandeau d'erreur global "Une erreur est survenue, réessayez ou écrivez-nous directement à redac@…".
- L'e-mail dans le message est un fallback humain — voir la section "Coordonnées" déjà présente dans l'aside du mockup.

## Repository changes

`ContactsRepo.create()` existe déjà. Il faut :

1. Ajouter `reason: ContactReason` au type `ContactCreateInput`.
2. Passer `reason` dans le `.insert(contacts).values(...)`.

Aucune autre modification au repo.

## Testing

### Vitest (couche unit/integration)

- `src/lib/contact/rate-limit.test.ts` — fonction pure (extraite du module) : sous-quota OK, dépassement → throw, fenêtre qui expire → reset.
- `src/lib/db/repositories/contacts.test.ts` — extension des tests existants (s'il y en a) ou création : `create()` avec `reason` valide insère ; `create()` sans `reason` → rejet TypeScript + Drizzle.

### Playwright (couche e2e HTTP/UI)

- `tests/e2e/contact.spec.ts` :
  - Submit valide → réponse 201 + écran de succès affiché.
  - Submit sans consent → erreur côté client, pas de POST.
  - Submit avec email invalide → erreur côté champ.
  - Submit 6× consécutifs → la 6e renvoie 429 et affiche le bandeau.
  - Reset après succès → formulaire vide réapparaît.

## Architecture decisions

### Pourquoi pas Server Action ?

Les Server Actions Next.js auraient évité un endpoint REST, mais :
- React Query nécessite une fonction `mutate` qui appelle un `fetch` — combiner avec une action serveur ajoute une indirection.
- Un endpoint public REST est plus simple à tester via Playwright (`request.post('/api/contact')`).
- Le pattern admin du projet (PATCH/DELETE via `/api/admin/...`) est cohérent avec un `/api/contact` public.

### Pourquoi pas de honeypot ?

Le rate-limit seul a été choisi par décision produit (V1 minimal). Si du spam apparaît dans l'admin, prochaine étape = ajouter Cloudflare Turnstile (déjà discuté). Le honeypot est un middle-ground non choisi.

### Pourquoi consent non pré-coché ?

CNIL / RGPD : le consentement doit être un acte positif explicite. Les cases pré-cochées sont non conformes. Le mockup actuel a `defaultChecked` — c'est un détail mockup à corriger.

## Future work (not in scope)

- **Cloudflare Turnstile** quand le rate-limit IP ne suffit plus.
- **Notification e-mail** vers `redac@maison-calorie.fr` via Resend.
- **Auto-reply** au visiteur (accusé de réception).
- **Filtre par `reason`** dans `/admin/contacts`.
- **Champ `attachment`** (PDF) pour signalement d'erreur avec capture.
- **Stockage Upstash** pour rate-limit cross-instance si scale horizontal.
