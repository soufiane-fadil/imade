import { NextRequest } from "next/server";
import { z } from "zod";
import { CategoriesRepo } from "@/lib/db/repositories/categories";
import { CategorySchema } from "@/lib/admin/validators/category";
import { created, fromError, ok } from "@/lib/api/respond";

const SortValues = z.enum(["name", "newest", "oldest"]);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const filter = {
      q: searchParams.get("q") ?? undefined,
      sort: SortValues.safeParse(searchParams.get("sort")).data,
    };
    const list = await CategoriesRepo.list(filter);
    return ok(list);
  } catch (err) {
    return fromError(err);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const input = CategorySchema.parse(body);
    const createdCategory = await CategoriesRepo.create(input);
    return created(createdCategory);
  } catch (err) {
    return fromError(err);
  }
}
