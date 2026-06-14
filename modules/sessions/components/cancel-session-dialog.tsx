"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { FeedbackRegion } from "@/components/feedback/feedback-region";
import {
  DialogBackdrop,
  DialogClose,
  DialogDescription,
  DialogPopup,
  DialogPortal,
  DialogRoot,
  DialogTitle,
} from "@/components/ui/dialog";
import { cancelWorkoutSessionAction } from "@/modules/sessions/actions/session.actions";

type CancelSessionDialogProps = {
  workoutId: string;
  sessionId: string;
  onClose: () => void;
  onSuccess?: () => void;
};

export function CancelSessionDialog({
  workoutId,
  sessionId,
  onClose,
  onSuccess,
}: CancelSessionDialogProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleOpenChange(open: boolean) {
    if (!open && !isPending) {
      onClose();
    }
  }

  function handleCancel() {
    setError(null);

    startTransition(async () => {
      const result = await cancelWorkoutSessionAction(workoutId, sessionId);

      if (!result.success) {
        setError(result.error);
        return;
      }

      onClose();

      if (onSuccess) {
        onSuccess();
      } else {
        router.refresh();
      }
    });
  }

  return (
    <DialogRoot open onOpenChange={handleOpenChange}>
      <DialogPortal>
        <DialogBackdrop />
        <DialogPopup>
          <div className="flex flex-col gap-1.5">
            <DialogTitle>Cancelar sessão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja cancelar esta sessão? Os registros feitos
              nela não serão considerados na sua evolução.
            </DialogDescription>
          </div>

          <div className="flex flex-col gap-4">
            <FeedbackRegion error={error} />

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
                Voltar
              </DialogClose>
              <Button
                type="button"
                variant="destructive"
                className="w-full sm:w-auto"
                disabled={isPending}
                aria-busy={isPending}
                onClick={handleCancel}
              >
                {isPending ? "Cancelando..." : "Cancelar sessão"}
              </Button>
            </div>
          </div>
        </DialogPopup>
      </DialogPortal>
    </DialogRoot>
  );
}
