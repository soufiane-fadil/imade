import "server-only";
import { and, asc, desc, eq, ilike, ne, or, sql } from "drizzle-orm";
import { db } from "../client";
import { users, type User, type UserRole, type UserStatus } from "../schema";
import { RepositoryError } from "../../errors";

export type UserFilter = {
  q?: string;
  role?: UserRole | "all";
  status?: UserStatus | "all";
  sort?: "newest" | "oldest" | "name";
};

export type UserCreateInput = {
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  status: UserStatus;
  lastLoginAt?: string | null;
};

export type UserUpdatePatch = Partial<UserCreateInput>;

async function assertEmailAvailable(
  email: string,
  excludeId?: string,
): Promise<void> {
  const lowered = email.toLowerCase();
  const rows = await db
    .select({ id: users.id })
    .from(users)
    .where(
      excludeId
        ? and(sql`lower(${users.email}) = ${lowered}`, ne(users.id, excludeId))
        : sql`lower(${users.email}) = ${lowered}`,
    )
    .limit(1);
  if (rows.length > 0) throw new RepositoryError("EMAIL_TAKEN", { email });
}

export const UsersRepo = {
  async list(filter: UserFilter = {}): Promise<User[]> {
    const conditions = [];
    if (filter.role && filter.role !== "all") {
      conditions.push(eq(users.role, filter.role));
    }
    if (filter.status && filter.status !== "all") {
      conditions.push(eq(users.status, filter.status));
    }
    if (filter.q) {
      const pattern = `%${filter.q}%`;
      const orClause = or(
        ilike(users.firstName, pattern),
        ilike(users.lastName, pattern),
        ilike(users.email, pattern),
      );
      if (orClause) conditions.push(orClause);
    }
    const where = conditions.length > 0 ? and(...conditions) : undefined;

    let orderBy;
    switch (filter.sort) {
      case "name":
        orderBy = asc(users.lastName);
        break;
      case "oldest":
        orderBy = asc(users.createdAt);
        break;
      case "newest":
      default:
        orderBy = desc(users.createdAt);
    }

    return db.select().from(users).where(where).orderBy(orderBy);
  },

  async get(id: string): Promise<User | null> {
    const rows = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return rows[0] ?? null;
  },

  async create(input: UserCreateInput): Promise<User> {
    await assertEmailAvailable(input.email);
    const [createdUser] = await db
      .insert(users)
      .values({
        email: input.email,
        firstName: input.firstName,
        lastName: input.lastName,
        role: input.role,
        status: input.status,
        lastLoginAt: input.lastLoginAt ? new Date(input.lastLoginAt) : null,
      })
      .returning();
    return createdUser;
  },

  async update(id: string, patch: UserUpdatePatch): Promise<User> {
    if (patch.email) await assertEmailAvailable(patch.email, id);
    const [updated] = await db
      .update(users)
      .set({
        ...(patch.email !== undefined && { email: patch.email }),
        ...(patch.firstName !== undefined && { firstName: patch.firstName }),
        ...(patch.lastName !== undefined && { lastName: patch.lastName }),
        ...(patch.role !== undefined && { role: patch.role }),
        ...(patch.status !== undefined && { status: patch.status }),
        ...(patch.lastLoginAt !== undefined && {
          lastLoginAt: patch.lastLoginAt ? new Date(patch.lastLoginAt) : null,
        }),
      })
      .where(eq(users.id, id))
      .returning();
    if (!updated) throw new RepositoryError("NOT_FOUND", { id });
    return updated;
  },

  async remove(id: string): Promise<void> {
    const result = await db
      .delete(users)
      .where(eq(users.id, id))
      .returning({ id: users.id });
    if (result.length === 0) throw new RepositoryError("NOT_FOUND", { id });
  },
};
