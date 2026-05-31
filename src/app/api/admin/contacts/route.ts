import { NextRequest } from "next/server";
import { z } from "zod";
import { ContactsRepo } from "@/lib/db/repositories/contacts";
import { ContactSchema } from "@/lib/admin/validators/contact";
import { created, fromError, ok } from "@/lib/api/respond";

const StatusFilter = z.enum(["unread", "handled", "archived", "all"]);
const SortValues = z.enum(["newest", "oldest"]);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const filter = {
      q: searchParams.get("q") ?? undefined,
      status: StatusFilter.safeParse(searchParams.get("status")).data,
      sort: SortValues.safeParse(searchParams.get("sort")).data,
    };
    const list = await ContactsRepo.list(filter);
    return ok(list);
  } catch (err) {
    return fromError(err);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const input = ContactSchema.parse(body);
    const contact = await ContactsRepo.create(input);
    return created(contact);
  } catch (err) {
    return fromError(err);
  }
}
