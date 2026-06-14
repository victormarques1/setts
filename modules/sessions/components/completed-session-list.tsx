import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { CompletedSessionSummary } from "@/modules/sessions/services/session.service";

type CompletedSessionListProps = {
  sessions: CompletedSessionSummary[];
};

function formatSessionDate(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(date);
}

function formatSessionDateShort(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function CompletedSessionList({ sessions }: CompletedSessionListProps) {
  if (sessions.length === 0) {
    return (
      <div className="empty-state-card w-full">
        <div className="flex flex-col gap-1.5">
          <p className="empty-state-title">Nenhum treino finalizado</p>
          <p className="empty-state-description">
            Finalize um treino para ver o histórico com data, exercícios e
            séries registradas.
          </p>
        </div>
        <Button render={<Link href="/workouts" />} nativeButton={false}>
          Ir para treinos
        </Button>
      </div>
    );
  }

  return (
    <ul className="flex w-full flex-col gap-2.5 px-0.5">
      {sessions.map((session) => (
        <li key={session.id}>
          <Link
            href={`/workouts/${session.workoutId}/sessions/${session.id}`}
            className="group block rounded-2xl focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <div className="list-card-interactive px-4 py-3.5">
              <div className="flex min-h-11 items-center justify-between gap-3">
                <div className="flex min-w-0 flex-col gap-1">
                  <span className="min-w-0 truncate font-semibold tracking-tight">
                    {session.workoutName}
                  </span>
                  <span
                    className="text-muted-foreground hidden text-xs sm:inline"
                    title={formatSessionDate(session.performedAt)}
                  >
                    {formatSessionDate(session.performedAt)}
                  </span>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <div className="flex flex-col items-end gap-0.5 sm:hidden">
                    <span className="metric-label">Concluído</span>
                    <span className="text-sm font-semibold tabular-nums">
                      {formatSessionDateShort(session.performedAt)}
                    </span>
                  </div>
                  <ChevronRight
                    className="text-muted-foreground size-4 shrink-0"
                    aria-hidden="true"
                  />
                </div>
              </div>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
