import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
    return "Nenhuma sessão realizada";
  }

  return `Última sessão: ${formatLastSessionDate(lastSessionAt)}`;
}

export function WorkoutList({ workouts }: WorkoutListProps) {
  if (workouts.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Nenhum treino cadastrado</CardTitle>
          <CardDescription>
            Crie seu primeiro treino para começar a registrar exercícios e
            séries.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button render={<Link href="/workouts/new" />} nativeButton={false}>
            Criar treino
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <ul className="flex w-full flex-col gap-3">
      {workouts.map((workout) => (
        <li key={workout.id}>
          <Link href={`/workouts/${workout.id}`} className="block">
            <Card className="min-h-11 py-4 transition-colors hover:bg-muted/50 active:bg-muted/50">
              <CardContent className="flex min-h-11 flex-col justify-center gap-1 py-0">
                <span className="min-w-0 truncate font-medium" title={workout.name}>
                  {workout.name}
                </span>
                <span className="text-muted-foreground text-sm">
                  {formatExerciseCount(workout.exerciseCount)} ·{" "}
                  {formatLastSession(workout.lastSessionAt)}
                </span>
              </CardContent>
            </Card>
          </Link>
        </li>
      ))}
    </ul>
  );
}
