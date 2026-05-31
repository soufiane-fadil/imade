"use client";

import * as React from "react";
import {
  type ControllerRenderProps,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";

type AdminFieldProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> = {
  name: TName;
  label?: React.ReactNode;
  required?: boolean;
  hint?: React.ReactNode;
  className?: string;
  /**
   * Render the actual input. Receives the RHF field bindings — spread them on
   * an `<input>` for register-style fields, or read `value`/`onChange` for
   * controlled custom components.
   */
  render: (
    field: ControllerRenderProps<TFieldValues, TName>,
  ) => React.ReactNode;
};

export function AdminField<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>({
  name,
  label,
  required,
  hint,
  className,
  render,
}: AdminFieldProps<TFieldValues, TName>) {
  return (
    <FormField<TFieldValues, TName>
      name={name}
      render={({ field }) => (
        <FormItem className={cn("afield", className)}>
          {label ? (
            <label htmlFor={field.name}>
              {label}
              {required ? <span className="req"> *</span> : null}
            </label>
          ) : null}
          <FormControl>{render(field)}</FormControl>
          {hint ? <div className="afield__hint">{hint}</div> : null}
          <FormMessage className="afield__hint !text-signal" />
        </FormItem>
      )}
    />
  );
}
