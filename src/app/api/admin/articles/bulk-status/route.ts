import { NextRequest } from "next/server";
import { z } from "zod";
import { ArticlesRepo } from "@/lib/db/repositories/articles";
import { fromError, ok } from "@/lib/api/respond";

const BulkStatusSchema = z.object({
  ids: z.array(z.string().min(1)).min(1),
  status: z.enum(["draft", "published", "archived"]),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { ids, status } = BulkStatusSchema.parse(body);
    const updated = await ArticlesRepo.setStatus(ids, status);
    return ok(updated);
  } catch (err) {
    return fromError(err);
  }
}
