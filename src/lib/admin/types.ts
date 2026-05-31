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

export { RepositoryError } from "../errors";
