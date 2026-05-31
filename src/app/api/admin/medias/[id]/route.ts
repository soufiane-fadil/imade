import { NextRequest } from "next/server";
import { MediasRepo } from "@/lib/db/repositories/medias";
import { MediaSchema } from "@/lib/admin/validators/media";
import { fromError, noContent, notFound, ok } from "@/lib/api/respond";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const media = await MediasRepo.get(id);
    if (!media) return notFound();
    return ok(media);
  } catch (err) {
    return fromError(err);
  }
}

export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const body = await request.json();
    const patch = MediaSchema.partial().parse(body);
    const updated = await MediasRepo.update(id, patch);
    return ok(updated);
  } catch (err) {
    return fromError(err);
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    await MediasRepo.remove(id);
    return noContent();
  } catch (err) {
    return fromError(err);
  }
}
