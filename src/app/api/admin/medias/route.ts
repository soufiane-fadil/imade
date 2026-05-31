import { NextRequest } from "next/server";
import { z } from "zod";
import { MediasRepo } from "@/lib/db/repositories/medias";
import { MediaSchema } from "@/lib/admin/validators/media";
import { created, fromError, ok } from "@/lib/api/respond";

const KindFilter = z.enum(["image", "pdf", "all"]);
const SortValues = z.enum(["newest", "oldest", "filename", "size"]);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const filter = {
      q: searchParams.get("q") ?? undefined,
      kind: KindFilter.safeParse(searchParams.get("kind")).data,
      sort: SortValues.safeParse(searchParams.get("sort")).data,
    };
    const list = await MediasRepo.list(filter);
    return ok(list);
  } catch (err) {
    return fromError(err);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const input = MediaSchema.parse(body);
    const media = await MediasRepo.create(input);
    return created(media);
  } catch (err) {
    return fromError(err);
  }
}
