import { NextRequest } from "next/server";
import { z } from "zod";
import { UsersRepo } from "@/lib/db/repositories/users";
import { UserSchema } from "@/lib/admin/validators/user";
import { created, fromError, ok } from "@/lib/api/respond";

const RoleFilter = z.enum(["admin", "editor", "reader", "all"]);
const StatusFilter = z.enum(["active", "suspended", "all"]);
const SortValues = z.enum(["newest", "oldest", "name"]);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const filter = {
      q: searchParams.get("q") ?? undefined,
      role: RoleFilter.safeParse(searchParams.get("role")).data,
      status: StatusFilter.safeParse(searchParams.get("status")).data,
      sort: SortValues.safeParse(searchParams.get("sort")).data,
    };
    const list = await UsersRepo.list(filter);
    return ok(list);
  } catch (err) {
    return fromError(err);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const input = UserSchema.parse(body);
    const user = await UsersRepo.create(input);
    return created(user);
  } catch (err) {
    return fromError(err);
  }
}
