"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type ConfirmVariant = "destructive" | "default";

type ConfirmDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmVariant?: ConfirmVariant;
  typeToConfirm?: string;
  typeToConfirmLabel?: string;
  onConfirm: () => void | Promise<void>;
};

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Supprimer",
  cancelLabel = "Annuler",
  confirmVariant = "destructive",
  typeToConfirm,
  typeToConfirmLabel,
  onConfirm,
}: ConfirmDialogProps) {
  const [typed, setTyped] = React.useState("");
  const [pending, setPending] = React.useState(false);

  const requiresType = typeof typeToConfirm === "string" && typeToConfirm.length > 0;
  const typeMatches = !requiresType || typed === typeToConfirm;
  const canConfirm = !pending && typeMatches;

  const handleConfirm = async () => {
    if (!canConfirm) return;
    try {
      setPending(true);
      await onConfirm();
    } finally {
      setPending(false);
    }
  };

  const buttonVariant: ConfirmVariant =
    confirmVariant === "destructive" ? "destructive" : "default";

  const handleOpenChange = (next: boolean) => {
    if (pending) return;
    if (!next) {
      // Reset transient state when closing to keep next open fresh.
      setTyped("");
      setPending(false);
    }
    onOpenChange(next);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {requiresType ? (
          <div className="grid gap-1.5">
            <Label htmlFor="confirm-type-input" className="text-xs">
              {typeToConfirmLabel ?? (
                <>
                  Pour confirmer, tapez{" "}
                  <code className="rounded bg-muted px-1 py-0.5 font-mono text-[11px]">
                    {typeToConfirm}
                  </code>
                </>
              )}
            </Label>
            <Input
              id="confirm-type-input"
              autoFocus
              autoComplete="off"
              value={typed}
              onChange={(event) => setTyped(event.target.value)}
              disabled={pending}
            />
          </div>
        ) : null}
        <DialogFooter>
          <Button
            variant="outline"
            disabled={pending}
            onClick={() => handleOpenChange(false)}
          >
            {cancelLabel}
          </Button>
          <Button
            variant={buttonVariant}
            disabled={!canConfirm}
            onClick={handleConfirm}
          >
            {pending ? "…" : confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
