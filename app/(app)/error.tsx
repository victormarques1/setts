"use client";

import { ErrorStateCard } from "@/components/feedback/error-state-card";

type AppErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function AppError({ error, reset }: AppErrorProps) {
  return (
    <div className="page-shell">
      <ErrorStateCard
        message={error.message || "Não foi possível carregar esta página. Verifique sua conexão e tente novamente."}
        onRetry={reset}
      />
    </div>
  );
}
