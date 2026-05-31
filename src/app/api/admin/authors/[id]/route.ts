import { NextRequest } from "next/server";
import { AuthorsRepo } from "@/lib/db/repositories/authors";
import { AuthorSchema } from "@/lib/admin/validators/author";
import { fromError, noContent, notFound, ok } from "@/lib/api/respond";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const author = await AuthorsRepo.get(id);
    if (!author) return notFound();
    return ok(author);
  } catch (err) {
    return fromError(err);
  }
}

export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const body = await request.json();
    const patch = AuthorSchema.partial().parse(body);
    const updated = await AuthorsRepo.update(id, patch);
    return ok(updated);
  } catch (err) {
    return fromError(err);
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    await AuthorsRepo.remove(id);
    return noContent();
  } catch (err) {
    return fromError(err);
  }
}
