"use client";

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
import { ErrorFeedback } from "@/components/feedback/error-feedback";

type FormDialogProps = {
  title: string;
  description: string;
  onClose: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  isPending: boolean;
  error: string | null;
  children: React.ReactNode;
  submitLabel?: string;
  pendingLabel?: string;
};

export function FormDialog({
  title,
  description,
  onClose,
  onSubmit,
  isPending,
  error,
  children,
  submitLabel = "Salvar",
  pendingLabel = "Salvando...",
}: FormDialogProps) {
  function handleOpenChange(open: boolean) {
    if (!open && !isPending) {
      onClose();
    }
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
          <form onSubmit={onSubmit} className="flex flex-col gap-4">
            {children}
            {error ? <ErrorFeedback message={error} /> : null}
            <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
              <DialogClose
                render={
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full sm:w-auto"
                    disabled={isPending}
                  />
                }
              >
                Cancelar
              </DialogClose>
              <Button
                className="w-full sm:w-auto"
                type="submit"
                disabled={isPending}
                aria-busy={isPending}
              >
                {isPending ? pendingLabel : submitLabel}
              </Button>
            </div>
          </form>
        </DialogPopup>
      </DialogPortal>
    </DialogRoot>
  );
}
