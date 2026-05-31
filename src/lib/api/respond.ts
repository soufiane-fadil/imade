import { NextResponse } from "next/server";
import { RepositoryError, isRepositoryError } from "../errors";
import { ZodError } from "zod";

export function ok<T>(data: T): NextResponse {
  return NextResponse.json(data);
}

export function created<T>(data: T): NextResponse {
  return NextResponse.json(data, { status: 201 });
}

export function noContent(): NextResponse {
  return new NextResponse(null, { status: 204 });
}

export function badRequest(message: string, details?: unknown): NextResponse {
  return NextResponse.json(
    { code: "BAD_REQUEST", message, ...(details ? { details } : {}) },
    { status: 400 },
  );
}

export function notFound(message = "Not found"): NextResponse {
  return NextResponse.json({ code: "NOT_FOUND", message }, { status: 404 });
}

const REPO_STATUS: Record<string, number> = {
  NOT_FOUND: 404,
  SLUG_TAKEN: 409,
  EMAIL_TAKEN: 409,
  CATEGORY_HAS_ARTICLES: 409,
  AUTHOR_HAS_ARTICLES: 409,
  MEDIA_IN_USE: 409,
  CATEGORY_NOT_FOUND: 404,
  AUTHOR_NOT_FOUND: 404,
};

export function fromError(err: unknown): NextResponse {
  if (err instanceof ZodError) {
    return badRequest("Validation failed", err.issues);
  }
  if (isRepositoryError(err)) {
    const status = REPO_STATUS[err.code] ?? 400;
    return NextResponse.json(
      { code: err.code, details: err.details },
      { status },
    );
  }
  console.error("Unhandled API error:", err);
  return NextResponse.json(
    { code: "INTERNAL_ERROR", message: "Unexpected server error" },
    { status: 500 },
  );
}

export { RepositoryError };
