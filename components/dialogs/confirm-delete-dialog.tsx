"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import {
  DialogBackdrop,
  DialogClose,
  DialogDescription,
  DialogPopup,
  DialogPortal,
  DialogRoot,
  DialogTitle,
} from "@/components/ui/dialog";
import { FeedbackRegion } from "@/components/feedback/feedback-region";

const SUCCESS_CLOSE_DELAY_MS = 1200;

type ConfirmDeleteDialogProps = {
  title: string;
  description: string;
  entityLabel: string;
  entityName: string;
  warning?: string;
  successMessage: string;
  onClose: () => void;
  onConfirm: () => Promise<{ success: true } | { success: false; error: string }>;
};

export function ConfirmDeleteDialog({
  title,
  description,
  entityLabel,
  entityName,
  warning,
  successMessage,
  onClose,
  onConfirm,
}: ConfirmDeleteDialogProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const isCompleted = success !== null;

  function handleOpenChange(open: boolean) {
    if (!open && !isPending) {
      onClose();
    }
  }

  function handleDelete() {
    setError(null);
    setSuccess(null);

    startTransition(async () => {
      const result = await onConfirm();

      if (!result.success) {
        setError(result.error);
        return;
      }

      setSuccess(successMessage);
      router.refresh();

      window.setTimeout(() => {
        onClose();
      }, SUCCESS_CLOSE_DELAY_MS);
    });
  }

  return (
    <DialogRoot open onOpenChange={handleOpenChange}>
      <DialogPortal>
        <DialogBackdrop />
        <DialogPopup>
          <div className="flex flex-col gap-1.5">
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </div>

          <div className="flex flex-col gap-4">
            <p className="text-sm">
              <span className="text-muted-foreground">{entityLabel}: </span>
              <span className="font-semibold">{entityName}</span>
            </p>
            {warning ? (
              <p className="text-muted-foreground text-sm">{warning}</p>
            ) : null}

            <FeedbackRegion error={error} success={success} />

            <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
              <DialogClose
                render={
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full sm:w-auto"
                    disabled={isPending || isCompleted}
                  />
                }
              >
                Cancelar
              </DialogClose>
              <Button
                type="button"
                variant="destructive"
                className="w-full sm:w-auto"
                disabled={isPending || isCompleted}
                aria-busy={isPending}
                onClick={handleDelete}
              >
                {isPending ? "Excluindo..." : "Excluir"}
              </Button>
            </div>
          </div>
        </DialogPopup>
      </DialogPortal>
    </DialogRoot>
  );
}
