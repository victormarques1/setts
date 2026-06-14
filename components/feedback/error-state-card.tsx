import { AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";

type ErrorStateCardProps = {
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryLabel?: string;
};

export function ErrorStateCard({
  title = "Algo deu errado",
  message = "Não foi possível carregar esta página. Verifique sua conexão e tente novamente.",
  onRetry,
  retryLabel = "Tentar novamente",
}: ErrorStateCardProps) {
  return (
    <div className="empty-state-card w-full" role="alert">
      <div className="flex flex-col items-center gap-3">
        <AlertCircle className="text-destructive size-10" aria-hidden="true" />
        <div className="flex flex-col gap-1.5">
          <p className="empty-state-title">{title}</p>
          <p className="empty-state-description">{message}</p>
        </div>
      </div>
      {onRetry ? (
        <Button type="button" onClick={onRetry}>
          {retryLabel}
        </Button>
      ) : null}
    </div>
  );
}
