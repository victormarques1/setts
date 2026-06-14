import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { WorkoutSummary } from "@/modules/workouts/services/workout.service";

type WorkoutListProps = {
  workouts: WorkoutSummary[];
};

function formatExerciseCount(count: number) {
  if (count === 1) {
    return "1 exercício";
  }

  return `${count} exercícios`;
}

function formatLastSessionDate(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "medium",
  }).format(date);
}

function formatLastSession(lastSessionAt: Date | null) {
  if (!lastSessionAt) {
    return "Sem sessões";
  }

  return formatLastSessionDate(lastSessionAt);
}

export function WorkoutList({ workouts }: WorkoutListProps) {
  if (workouts.length === 0) {
    return (
      <div className="empty-state-card w-full">
        <div className="flex flex-col gap-1.5">
          <p className="empty-state-title">Nenhum treino cadastrado</p>
          <p className="empty-state-description">
            Crie seu primeiro treino para começar a registrar cargas e ver sua
            evolução.
          </p>
        </div>
        <Button render={<Link href="/workouts/new" />} nativeButton={false}>
          Criar treino
        </Button>
      </div>
    );
  }

  return (
    <ul className="flex w-full flex-col gap-2.5 px-0.5">
      {workouts.map((workout) => (
        <li key={workout.id}>
          <Link
            href={`/workouts/${workout.id}`}
            className="group block rounded-2xl focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <div className="list-card-interactive px-4 py-3.5">
              <div className="flex min-h-11 items-center justify-between gap-3">
                <div className="flex min-w-0 flex-col gap-1">
                  <span
                    className="min-w-0 truncate font-semibold tracking-tight"
                    title={workout.name}
                  >
                    {workout.name}
                  </span>
                  <span className="text-muted-foreground text-xs">
                    {formatExerciseCount(workout.exerciseCount)}
                  </span>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <div className="flex flex-col items-end gap-0.5">
                    <span className="metric-label">Última sessão</span>
                    <span className="text-sm font-semibold tabular-nums">
                      {formatLastSession(workout.lastSessionAt)}
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
