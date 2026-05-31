import { NextRequest } from "next/server";
import { z } from "zod";
import { AuthorsRepo } from "@/lib/db/repositories/authors";
import { AuthorSchema } from "@/lib/admin/validators/author";
import { created, fromError, ok } from "@/lib/api/respond";

const SortValues = z.enum(["name", "newest", "oldest"]);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const filter = {
      q: searchParams.get("q") ?? undefined,
      sort: SortValues.safeParse(searchParams.get("sort")).data,
    };
    const list = await AuthorsRepo.list(filter);
    return ok(list);
  } catch (err) {
    return fromError(err);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const input = AuthorSchema.parse(body);
    const author = await AuthorsRepo.create(input);
    return created(author);
  } catch (err) {
    return fromError(err);
  }
}
