"use client";

import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { toast } from "sonner";

type Opts<TData, TVars> = UseMutationOptions<TData, Error, TVars> & {
  successMessage?: string | ((data: TData, vars: TVars) => string);
  errorMessage?: string | ((err: Error, vars: TVars) => string);
};

export function useAdminMutation<TData, TVars>(opts: Opts<TData, TVars>) {
  const {
    successMessage,
    errorMessage,
    onSuccess,
    onError,
    ...rest
  } = opts;

  return useMutation<TData, Error, TVars>({
    ...rest,
    onSuccess: (data, vars, onMutateResult, ctx) => {
      const msg =
        typeof successMessage === "function"
          ? successMessage(data, vars)
          : successMessage;
      if (msg) toast.success(msg);
      onSuccess?.(data, vars, onMutateResult, ctx);
    },
    onError: (err, vars, onMutateResult, ctx) => {
      const msg =
        typeof errorMessage === "function"
          ? errorMessage(err, vars)
          : (errorMessage ?? err.message);
      toast.error(msg);
      onError?.(err, vars, onMutateResult, ctx);
    },
  });
}
