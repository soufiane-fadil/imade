import { NextRequest } from "next/server";
import { ArticlesRepo } from "@/lib/db/repositories/articles";
import { ArticleSchema } from "@/lib/admin/validators/article";
import { fromError, noContent, notFound, ok } from "@/lib/api/respond";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const article = await ArticlesRepo.get(id);
    if (!article) return notFound();
    return ok(article);
  } catch (err) {
    return fromError(err);
  }
}

export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const body = await request.json();
    const patch = ArticleSchema.partial().parse(body);
    const updated = await ArticlesRepo.update(id, patch);
    return ok(updated);
  } catch (err) {
    return fromError(err);
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    await ArticlesRepo.remove(id);
    return noContent();
  } catch (err) {
    return fromError(err);
  }
}
