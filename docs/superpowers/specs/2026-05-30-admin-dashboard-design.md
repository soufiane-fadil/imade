# Admin Dashboard — Design Spec

**Date** : 2026-05-30
**Auteur** : Soufiane + Claude (brainstorming)
**Statut** : design validé, prêt pour plan d'implémentation
**Scope** : front-end uniquement, données mockées en localStorage. Auth Kinde et upload Cloudflare R2 hors scope (étapes ultérieures).

## 1. Contexte et objectif

Le site Maison·Calorie est un éditorial Next.js 16 / Tailwind v4 avec une esthétique « papier journal » distinctive. Aujourd'hui il n'a ni base de données ni back-office — toutes les pages publiques lisent `src/lib/data.ts`.

Cette spec décrit un **admin dashboard isolé** sous `(admin)/admin/*` permettant de gérer le contenu éditorial via une UI moderne type SaaS, en s'appuyant sur **shadcn/ui**. Les données vivent en localStorage et seront remplacées par une API réelle plus tard ; l'architecture est conçue pour que cette bascule ne touche que la couche `repositories`.

L'authentification (Kinde.com, scope `admin`) sera ajoutée dans une phase ultérieure — pour l'instant, l'admin est librement accessible côté front.

## 2. Modules livrés

| Module       | Liste                                                                                                                          | Filtres                                     | Détail               | Create               | Edit                  | Delete                          |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------- | -------------------- | -------------------- | --------------------- | ------------------------------- |
| Catégories   | ✅                                                                                                                             | recherche, tri                              | ✅                   | ✅                   | ✅                    | ✅ (garde-fou si articles liés) |
| Articles     | ✅                                                                                                                             | statut, catégorie, auteur, recherche, dates | ✅                   | ✅                   | ✅                    | ✅                              |
| Auteurs      | ✅                                                                                                                             | recherche                                   | ✅                   | ✅                   | ✅                    | ✅ (garde-fou si articles liés) |
| Utilisateurs | ✅                                                                                                                             | rôle, statut, recherche                     | ✅                   | ✅                   | ✅                    | ✅ (suspendre + supprimer)      |
| Médias       | ✅                                                                                                                             | type (image/pdf), recherche                 | ✅ (panneau latéral) | 🚫 visuel uniquement | métadonnées éditables | ✅                              |
| Contacts     | ✅                                                                                                                             | statut (non lu/traité/archivé), recherche   | ✅                   | 🚫                   | marquage statut       | ✅                              |
| Dashboard    | KPI : articles publiés, brouillons, messages non lus, nouveaux utilisateurs 7j ; listes derniers articles et derniers contacts |

## 3. Stack technique

### Dépendances ajoutées

- **shadcn/ui** (CLI) — Button, Input, Select, Table, Dialog, Sheet, DropdownMenu, Toast, Tabs, Card, Badge, Avatar, Form, Skeleton, Checkbox, Command.
- **@tanstack/react-query** v5 — cache des reads, mutations optimistes.
- **@tanstack/react-table** v8 — table headless (tri/pagination/sélection).
- **react-hook-form** + **zod** + **@hookform/resolvers** — validation typée des formulaires.
- **@tiptap/react** + extensions (starter-kit, image, link, table) — WYSIWYG.
- **cmdk** — palette de commandes (recherche globale ⌘K).
- **sonner** — toasts.
- **next-themes** — light/dark.
- **date-fns** — formatage FR.
- **lucide-react** — icônes.

### Configuration shadcn

Thème mappé sur les tokens Tailwind v4 existants :

- `--background` → `--color-paper`
- `--foreground` → `--color-ink`
- `--primary` → `--color-ink`
- `--accent` → `--color-signal`
- Dark mode : palette adaptée (paper sombre, ink clair) — à valider visuellement à l'étape 1.

## 4. Modèles de données

Tous dans `src/lib/admin/types.ts`. Types conçus pour mapper directement sur ce qu'une API REST/Prisma retournera plus tard.

```ts
type ID = string; // ulid/uuid généré côté client
type ISODate = string;
type Slug = string; // [a-z0-9-]

// ---------- Category ----------
type Category = {
  id: ID;
  name: string;
  slug: Slug;
  descriptionHtml: string;
  articleCount: number; // dérivé
  createdAt: ISODate;
  updatedAt: ISODate;
};

// ---------- Author ----------
type Author = {
  id: ID;
  name: string;
  slug: Slug;
  descriptionHtml: string;
  photoUrl: string | null;
  articleCount: number; // dérivé
  createdAt: ISODate;
  updatedAt: ISODate;
};

// ---------- Media ----------
type MediaKind = "image" | "pdf";
type Media = {
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

// ---------- Article ----------
type ArticleStatus = "draft" | "published" | "archived";

type FaqItem = {
  question: string;
  answer: string;
};

type Article = {
  id: ID;
  title: string; // H1
  slug: Slug;
  seoExcerpt: string; // ~160 chars
  metaDescription: string;
  metaKeywords: string[];
  contentHtml: string; // Tiptap output
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

// ---------- User (back-office) ----------
type UserRole = "admin" | "editor" | "reader";
type UserStatus = "active" | "suspended";

type User = {
  id: ID;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  status: UserStatus;
  lastLoginAt: ISODate | null;
  createdAt: ISODate;
};

// ---------- Contact submission ----------
type ContactStatus = "unread" | "handled" | "archived";

type ContactSubmission = {
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
```

### Règles métier

- **Pas de cascade silencieuse** : supprimer `Category` ou `Author` référencés par un `Article` est bloqué. UI affiche le compte et propose réassignation.
- **`articleCount`** est dérivé à la volée par le repository (non stocké).
- **`readingMinutes`** : éditable, bouton « Calculer » applique `Math.max(1, Math.round(wordCount / 220))` sur `contentHtml`.
- **`metaKeywords`** : input avec chips (Enter pour valider).
- **Slug** : auto-généré depuis titre/nom (slugify FR sans accents), éditable, unicité vérifiée à la création.

## 5. Architecture des données

### Arborescence

```
src/lib/admin/
├── types.ts                          # tous les types
├── seed.ts                           # données initiales
├── storage.ts                        # wrapper localStorage typé + versioning
├── repositories/
│   ├── base.ts                       # interface Repository<T>
│   ├── categories.ts
│   ├── articles.ts                   # filtres riches, transitions de statut
│   ├── authors.ts
│   ├── users.ts
│   ├── medias.ts                     # read-only à ce stade
│   └── contacts.ts
├── queries/                          # hooks React Query
│   ├── use-categories.ts
│   ├── use-articles.ts
│   ├── use-authors.ts
│   ├── use-users.ts
│   ├── use-medias.ts
│   └── use-contacts.ts
└── validators/                       # schémas zod (un par entité)
    ├── category.ts
    ├── article.ts
    └── …
```

### Storage versionné

```ts
const STORAGE_KEY = "mc.admin.v1"; // bump version → invalide le seed local

type Snapshot = {
  version: 1;
  categories: Category[];
  articles: Article[];
  authors: Author[];
  users: User[];
  medias: Media[];
  contacts: ContactSubmission[];
};

function load(): Snapshot; // si absent ou version <, applique seed
function save(snapshot: Snapshot): void;
function reset(): void; // dev only — bouton dans footer admin
```

### Repository interface

```ts
interface Repository<T, Filter = unknown> {
  list(filter?: Filter): Promise<T[]>;
  get(id: ID): Promise<T | null>;
  create(input: Omit<T, "id" | "createdAt" | "updatedAt">): Promise<T>;
  update(id: ID, patch: Partial<T>): Promise<T>;
  remove(id: ID): Promise<void>;
}
```

Toutes les méthodes sont `Promise` même en synchrone (`await sleep(150)` simule la latence). Le jour où on branche `fetch()`, la signature ne change pas.

### Filtre Articles

```ts
type ArticleFilter = {
  q?: string;
  status?: ArticleStatus | "all";
  categoryId?: ID;
  authorId?: ID;
  dateFrom?: ISODate;
  dateTo?: ISODate;
  sort?: "newest" | "oldest" | "title" | "reading";
  page?: number;
  pageSize?: number; // défaut 20
};
```

### Couche React Query

- `QueryClientProvider` dans `app/(admin)/admin/layout.tsx`.
- Clés stables : `["articles", "list", filter]`, `["articles", "detail", id]`.
- `staleTime: 30s`.
- **Mutations optimistes** : `createArticle` injecte un placeholder dans le cache puis remplace au retour.
- Wrapper `useAdminMutation` qui montre toasts succès/erreur via `sonner` automatiquement.

### Dénormalisation côté hook

`repo.list()` retourne des entités avec FK uniquement. Pour les listes UI, `useArticlesWithRelations()` join côté client à partir du cache (categories/authors déjà chargés) et renvoie `Article & { category; author }`. Pas de stockage dénormalisé.

### Garde-fous suppression

```ts
// repositories/categories.ts
async remove(id: ID) {
  const count = articles.filter(a => a.categoryId === id).length;
  if (count > 0) throw new RepositoryError("CATEGORY_HAS_ARTICLES", { count });
  // …
}
```

UI catch et affiche un dialog explicite : compte d'articles utilisant la catégorie + bouton « Voir ces articles » qui navigue vers `/admin/articles?categoryId=<id>`. Pas de bulk-reassign magique — l'utilisateur édite/réassigne manuellement puis retente la suppression. Même pattern pour Auteurs et Médias.

### Bouton reset (dev)

Dans le footer du layout admin : `Reset local data` appelle `storage.reset()` et recharge.

## 6. Routes et layout

### Routes (App Router)

```
src/app/
├── (admin)/                           # route group
│   └── admin/
│       ├── layout.tsx                 # sidebar + topbar + providers
│       ├── page.tsx                   # dashboard
│       ├── categories/
│       │   ├── page.tsx
│       │   └── [slug]/page.tsx        # /new aussi
│       ├── articles/
│       │   ├── page.tsx
│       │   └── [id]/page.tsx
│       ├── auteurs/
│       │   ├── page.tsx
│       │   └── [slug]/page.tsx
│       ├── utilisateurs/
│       │   ├── page.tsx
│       │   └── [id]/page.tsx
│       ├── medias/
│       │   └── page.tsx
│       └── contacts/
│           ├── page.tsx
│           └── [id]/page.tsx
```

**Pourquoi route group `(admin)`** : layout admin complètement séparé du site public (chrome différent). Le route group permet ça sans polluer l'URL.

### Layout général

```
┌──────────────────────────────────────────────────────────────────┐
│ TOPBAR (h-14, border-b)                                          │
│ ≡  Maison·Calorie / Admin    [⌘K Recherche…]      🌗  👤 Léa ▾  │
├──────────┬───────────────────────────────────────────────────────┤
│ SIDEBAR  │ MAIN (px-6 py-6, full with)                           │
│ (w-60,   │ ┌────────────────────────────────────────────┐        │
│ border-r)│ │ Breadcrumb · Title · Action principale     │        │
│          │ ├────────────────────────────────────────────┤        │
│ ▦ Dashboard│ │                                          │        │
│ 🏷 Catég. │ │            Contenu de page                │        │
│ 📰 Articles│ │                                          │        │
│ ✍ Auteurs│ │                                            │        │
│ 👥 Util. │ │                                            │        │
│ 🖼 Médias│ │                                            │        │
│ ✉ Contacts│ │                                           │        │
│          │ │                                            │        │
│ [Reset]  │ └────────────────────────────────────────────┘        │
└──────────┴───────────────────────────────────────────────────────┘
```

## 7. Composants partagés

```
src/components/admin/
├── shell/
│   ├── admin-shell.tsx              # container layout
│   ├── sidebar.tsx                  # nav, badge counts (drafts, contacts non lus)
│   ├── topbar.tsx                   # logo, ⌘K, avatar dropdown
│   ├── command-palette.tsx          # cmdk
│   ├── breadcrumb.tsx
│   └── page-header.tsx              # titre + sous-titre + slot actions
├── data/
│   ├── data-table.tsx               # tanstack-table + shadcn
│   ├── data-table-toolbar.tsx
│   ├── data-table-pagination.tsx
│   ├── column-header.tsx            # tri cliquable
│   ├── row-actions.tsx              # menu ⋯
│   └── bulk-actions-bar.tsx
├── forms/
│   ├── form-section.tsx
│   ├── slug-input.tsx               # auto + éditable
│   ├── keywords-input.tsx           # chips Enter
│   ├── status-select.tsx
│   ├── reading-time-input.tsx       # input + bouton "Calculer"
│   ├── faq-editor.tsx               # ajout/supprime/réordonne
│   ├── media-picker.tsx             # dialog bibliothèque (single/multi)
│   ├── relation-picker.tsx          # combobox Author/Category
│   └── rich-text-editor.tsx         # Tiptap (lazy-loaded)
├── feedback/
│   ├── empty-state.tsx
│   ├── confirm-dialog.tsx           # destructive avec saisie typée
│   └── status-badge.tsx
└── kpi/
    ├── stat-card.tsx
    └── recent-list.tsx
```

## 8. Conventions UX

| Décision             | Détail                                                                                            |
| -------------------- | ------------------------------------------------------------------------------------------------- |
| Sidebar              | Fixe desktop, `Sheet` drawer sur mobile                                                           |
| Recherche globale ⌘K | `cmdk` — cross-entités + raccourcis d'action                                                      |
| Page header          | `<PageHeader title subtitle actions />` cohérent                                                  |
| Tables               | Tri colonne, sélection multiple, pagination 20/page, colonnes visibles persistées en localStorage |
| Filtres              | Toolbar : recherche + selects + reset. État synchronisé avec l'URL (`?status=draft&cat=pompes`)   |
| Bulk actions         | Barre flottante en bas, apparaît à ≥1 ligne sélectionnée                                          |
| Suppression          | `<ConfirmDialog>` typé (« Tapez le titre pour confirmer ») pour destructives sérieuses            |
| Toasts               | `sonner` bas-droite. Undo possible sur suppression (5s) via `repo.removeWithUndo()`               |
| Empty states         | Illustration + message + CTA                                                                      |
| Loading              | `<Skeleton>` shadcn, jamais spinner solo                                                          |
| Erreurs              | Bandeau rouge en haut + détails repliés, pas de redirection                                       |
| Densité              | Boutons/inputs `size="sm"` dans tables, `default` dans formulaires                                |
| Raccourcis           | `⌘K` recherche · `c` nouveau (depuis liste) · `/` focus recherche · `Esc` ferme dialogs           |

### Formulaire Article (le plus riche)

Layout 2 colonnes desktop (66% / 33%), 1 colonne mobile.

**Colonne principale**

1. Titre (H1 visuel)
2. Slug (auto, éditable)
3. Extrait SEO (textarea + compteur 160)
4. Contenu (Tiptap, min-h 500px)
5. FAQ (FaqEditor, accordéon Q/R)

**Colonne latérale** (sticky)

1. Publication : statut, date publication, `Enregistrer brouillon` + `Publier`
2. Catégorie (RelationPicker)
3. Auteur (RelationPicker avec avatar)
4. Média : cover (single) + médias joints (multi)
5. Temps de lecture (input + Calculer)
6. SEO : meta description (textarea) + meta keywords (chips)

**Barre d'actions bas de page** (sticky bottom mobile) : `Annuler · Aperçu · Enregistrer · Publier`.

### Aperçu article

Bouton `Aperçu` ouvre une `Sheet` plein écran avec le rendu HTML du contenu stylé via la classe `.prose` existante du site. Pas de route dédiée.

## 9. Écrans par entité

### Dashboard `/admin`

- 4 `StatCard` cliquables → liste filtrée correspondante
- Grille 2 colonnes : derniers articles édités · derniers contacts non lus
- Bandeau d'info : « Vous travaillez sur des données locales. L'auth Kinde et l'API seront branchées plus tard. »

### Catégories `/admin/categories`

- Liste : Nom · Slug · Articles (count) · Mise à jour. Recherche + tri.
- Formulaire : Nom · Slug · Description (Tiptap court, 200px).
- Suppression bloquée si `articleCount > 0` (dialog explicite).

### Articles `/admin/articles`

- Liste 6 colonnes : ☐ · Titre+extrait · Catégorie · Auteur · Statut · Publié.
- Filtres : recherche, statut, catégorie, auteur, dates. État dans l'URL.
- Bulk actions : Publier · Archiver · Réassigner catégorie · Supprimer.
- Formulaire : voir section 8.

### Auteurs `/admin/auteurs`

- Grille de cartes (3 col desktop) : photo, nom, count articles, slug.
- Formulaire : Photo URL (preview) · Nom · Slug · Description (Tiptap court).
- Suppression bloquée si articles liés.

### Utilisateurs `/admin/utilisateurs`

- Table : ☐ · Avatar+Nom · Email · Rôle · Statut · Dernière connexion · Créé.
- Filtres : rôle, statut, recherche.
- Suspendre/Réactiver inline. Bandeau d'info Kinde.

### Médias `/admin/medias`

- Grille de cartes 4 col : aperçu image (16:9) ou icône PDF + dimensions/taille/filename.
- Toolbar : recherche · Type (Tous/Images/PDF) · Tri.
- Bouton `+ Ajouter` ouvre une `Dialog` avec drag-zone visuelle non fonctionnelle + bandeau « Upload R2 bientôt » + un onglet fonctionnel `Importer une URL externe` : formulaire URL + type (image/pdf) + alt + caption → crée une entrée `Media` pointant vers l'URL collée, sans copier le fichier (mock).
- `Sheet` détail latéral : aperçu grand format, métadonnées éditables (alt, caption), copier URL, supprimer.
- Suppression bloquée si utilisé comme cover ou attaché à un article (compte d'usage affiché).

### Contacts `/admin/contacts`

- Inbox : ☐ · Statut (point) · Nom+email · Sujet · Aperçu message · Date. Non lus en gras.
- Tabs : Non lus · Traités · Archivés.
- Détail `/admin/contacts/[id]` : layout 2 colonnes. Gauche : message + métadonnées. Droite : actions verticales (Marquer traité · Archiver · Supprimer · Copier email · Ouvrir mailto:).
- Pas de marquage auto-traité à l'ouverture (KISS).

## 10. Plan d'implémentation (7 étapes)

Chaque étape est livrable et testable visuellement.

1. **Fondations** — install deps, configure shadcn (thème), types, seed, storage.
2. **Couche données** — repositories + validators + hooks React Query + `useAdminMutation`.
3. **Shell admin** — route group, layout, sidebar, topbar, command palette, dashboard.
4. **Composants partagés data** — data-table générique, toolbar, pagination, row-actions, bulk-actions, status-badge, empty-state, confirm-dialog, hook URL ↔ filtres.
5. **Modules simples** — Catégories, Auteurs, Utilisateurs, Contacts (liste + form, garde-fous).
6. **Module Articles** — composants spécifiques (slug, keywords, reading-time, faq-editor, relation-picker, media-picker, rich-text-editor Tiptap), liste filtrée, formulaire 2 colonnes, Sheet d'aperçu.
7. **Module Médias** — grille, sheet de détail, dialog d'ajout désactivé + import URL fonctionnel.

## 11. Seed

| Entité     | Quantité | Source                                                                                                   |
| ---------- | -------- | -------------------------------------------------------------------------------------------------------- |
| Categories | 8        | les 8 actuelles de `CATEGORIES`, description HTML enrichie                                               |
| Authors    | 6        | les 5 noms actuels + 1 inventé. Photos via `i.pravatar.cc`                                               |
| Medias     | ~30      | 25 images (Unsplash, `IMG_BANK` étendu) + 5 PDFs mock                                                    |
| Articles   | 20       | les 8 actuels enrichis (contenu HTML, FAQ, médias) + 12 générés. Mix : 14 published, 4 draft, 2 archived |
| Users      | 5        | 1 admin (`soufianosse@gmail.com`), 2 editor, 2 reader                                                    |
| Contacts   | 12       | 5 non lus, 4 traités, 3 archivés, dates étalées sur 30 jours                                             |

## 12. Hors scope (rappels explicites)

- ❌ **Auth Kinde** + garde de route `hasScope('admin')` — phase ultérieure.
- ❌ **Upload Cloudflare R2** — UI désactivée avec bandeau d'info.
- ❌ **Envoi d'emails** (réponse contacts) — pure action mock.
- ❌ **Pages publiques** — aucune modification, le site continue de lire `lib/data.ts` exactement comme avant.
- ❌ **Fusion data publique ↔ data admin** — le seed admin est une nouvelle source dans `lib/admin/seed.ts`. La bascule des pages publiques vers les repositories est une étape future explicite.

## 13. Risques et mitigations

| Risque                                               | Mitigation                                                                                         |
| ---------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| Bundle Tiptap + shadcn lourd (~250 KB gzip)          | Route group `(admin)` séparé, code-splitting par route, Tiptap en `dynamic import` côté formulaire |
| Limite localStorage 5 MB                             | Pas de base64 dans le seed (URLs externes). ~20 articles HTML = ~200 KB, OK jusqu'à 200+           |
| Hydration                                            | Tout l'admin est `"use client"` ; RSC sert le shell uniquement                                     |
| Lisibilité shadcn dark mode avec palette `paper/ink` | Validation visuelle obligatoire à l'étape 1 (Fondations) avant de continuer                        |
