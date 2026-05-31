import { NextRequest } from "next/server";
import { z } from "zod";
import { ArticlesRepo } from "@/lib/db/repositories/articles";
import { ArticleSchema } from "@/lib/admin/validators/article";
import { created, fromError, ok } from "@/lib/api/respond";

const StatusFilter = z.enum(["draft", "published", "archived", "all"]);
const SortKey = z.enum([
  "newest",
  "oldest",
  "title",
  "publishedDesc",
  "publishedAsc",
]);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const pageRaw = searchParams.get("page");
    const pageSizeRaw = searchParams.get("pageSize");
    const filter = {
      q: searchParams.get("q") ?? undefined,
      status: StatusFilter.safeParse(searchParams.get("status")).data,
      categoryId: searchParams.get("categoryId") ?? undefined,
      authorId: searchParams.get("authorId") ?? undefined,
      sort: SortKey.safeParse(searchParams.get("sort")).data,
      page: pageRaw ? Number(pageRaw) : undefined,
      pageSize: pageSizeRaw ? Number(pageSizeRaw) : undefined,
    };
    const result = await ArticlesRepo.list(filter);
    return ok(result);
  } catch (err) {
    return fromError(err);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const input = ArticleSchema.parse(body);
    const article = await ArticlesRepo.create(input);
    return created(article);
  } catch (err) {
    return fromError(err);
  }
}
