import { NextRequest } from "next/server";
import { z } from "zod";
import { ContactsRepo } from "@/lib/db/repositories/contacts";
import { fromError, noContent, notFound, ok } from "@/lib/api/respond";

type Params = { params: Promise<{ id: string }> };

const StatusActionSchema = z.object({
  action: z.enum(["mark-handled", "mark-archived", "mark-unread"]),
  byUserId: z.string().optional(),
});

export async function GET(_request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const contact = await ContactsRepo.get(id);
    if (!contact) return notFound();
    return ok(contact);
  } catch (err) {
    return fromError(err);
  }
}

export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { action, byUserId } = StatusActionSchema.parse(body);
    let result;
    switch (action) {
      case "mark-handled":
        if (!byUserId) {
          return new Response(
            JSON.stringify({
              code: "BAD_REQUEST",
              message: "byUserId required",
            }),
            { status: 400, headers: { "Content-Type": "application/json" } },
          );
        }
        result = await ContactsRepo.markHandled(id, byUserId);
        break;
      case "mark-archived":
        result = await ContactsRepo.markArchived(id);
        break;
      case "mark-unread":
        result = await ContactsRepo.markUnread(id);
        break;
    }
    return ok(result);
  } catch (err) {
    return fromError(err);
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    await ContactsRepo.remove(id);
    return noContent();
  } catch (err) {
    return fromError(err);
  }
}
