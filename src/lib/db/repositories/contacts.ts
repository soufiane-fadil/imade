import "server-only";
import { and, asc, desc, eq, ilike, or } from "drizzle-orm";
import { db } from "../client";
import { contacts, type Contact, type ContactStatus } from "../schema";
import { RepositoryError } from "../../errors";

export type ContactFilter = {
  q?: string;
  status?: ContactStatus | "all";
  sort?: "newest" | "oldest";
};

export type ContactCreateInput = {
  name: string;
  email: string;
  subject: string;
  message: string;
  status?: ContactStatus;
};

async function updateOrFail(
  id: string,
  patch: {
    status?: ContactStatus;
    handledAt?: Date | null;
    handledByUserId?: string | null;
  },
): Promise<Contact> {
  const [updated] = await db
    .update(contacts)
    .set(patch)
    .where(eq(contacts.id, id))
    .returning();
  if (!updated) throw new RepositoryError("NOT_FOUND", { id });
  return updated;
}

export const ContactsRepo = {
  async list(filter: ContactFilter = {}): Promise<Contact[]> {
    const conditions = [];
    if (filter.status && filter.status !== "all") {
      conditions.push(eq(contacts.status, filter.status));
    }
    if (filter.q) {
      const pattern = `%${filter.q}%`;
      const orClause = or(
        ilike(contacts.subject, pattern),
        ilike(contacts.message, pattern),
        ilike(contacts.name, pattern),
        ilike(contacts.email, pattern),
      );
      if (orClause) conditions.push(orClause);
    }
    const where = conditions.length > 0 ? and(...conditions) : undefined;

    let orderBy;
    switch (filter.sort) {
      case "oldest":
        orderBy = asc(contacts.createdAt);
        break;
      case "newest":
      default:
        orderBy = desc(contacts.createdAt);
    }

    return db.select().from(contacts).where(where).orderBy(orderBy);
  },

  async get(id: string): Promise<Contact | null> {
    const rows = await db
      .select()
      .from(contacts)
      .where(eq(contacts.id, id))
      .limit(1);
    return rows[0] ?? null;
  },

  async create(input: ContactCreateInput): Promise<Contact> {
    const [createdContact] = await db
      .insert(contacts)
      .values({
        name: input.name,
        email: input.email,
        subject: input.subject,
        message: input.message,
        status: input.status ?? "unread",
      })
      .returning();
    return createdContact;
  },

  async remove(id: string): Promise<void> {
    const result = await db
      .delete(contacts)
      .where(eq(contacts.id, id))
      .returning({ id: contacts.id });
    if (result.length === 0) throw new RepositoryError("NOT_FOUND", { id });
  },

  async markHandled(id: string, byUserId: string): Promise<Contact> {
    return updateOrFail(id, {
      status: "handled",
      handledAt: new Date(),
      handledByUserId: byUserId,
    });
  },

  async markArchived(id: string): Promise<Contact> {
    return updateOrFail(id, { status: "archived" });
  },

  async markUnread(id: string): Promise<Contact> {
    return updateOrFail(id, {
      status: "unread",
      handledAt: null,
      handledByUserId: null,
    });
  },
};
