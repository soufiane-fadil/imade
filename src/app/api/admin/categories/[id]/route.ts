import { NextRequest } from "next/server";
import { CategoriesRepo } from "@/lib/db/repositories/categories";
import { CategorySchema } from "@/lib/admin/validators/category";
import { fromError, noContent, notFound, ok } from "@/lib/api/respond";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const category = await CategoriesRepo.get(id);
    if (!category) return notFound();
    return ok(category);
  } catch (err) {
    return fromError(err);
  }
}

export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const body = await request.json();
    const patch = CategorySchema.partial().parse(body);
    const updated = await CategoriesRepo.update(id, patch);
    return ok(updated);
  } catch (err) {
    return fromError(err);
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    await CategoriesRepo.remove(id);
    return noContent();
  } catch (err) {
    return fromError(err);
  }
}
