export class RepositoryError extends Error {
  constructor(
    public code: string,
    public details: Record<string, unknown> = {},
  ) {
    super(code);
    this.name = "RepositoryError";
  }
}

export function isRepositoryError(err: unknown): err is RepositoryError {
  return err instanceof RepositoryError;
}
