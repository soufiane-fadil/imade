import { NextRequest } from "next/server";
import { UsersRepo } from "@/lib/db/repositories/users";
import { UserSchema } from "@/lib/admin/validators/user";
import { fromError, noContent, notFound, ok } from "@/lib/api/respond";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const user = await UsersRepo.get(id);
    if (!user) return notFound();
    return ok(user);
  } catch (err) {
    return fromError(err);
  }
}

export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const body = await request.json();
    const patch = UserSchema.partial().parse(body);
    const updated = await UsersRepo.update(id, patch);
    return ok(updated);
  } catch (err) {
    return fromError(err);
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    await UsersRepo.remove(id);
    return noContent();
  } catch (err) {
    return fromError(err);
  }
}
