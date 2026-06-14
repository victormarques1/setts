import Link from "next/link";

import type { Exercise, SetRecord } from "@/app/generated/prisma/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type SessionExerciseListProps = {
  workoutId: string;
  sessionId: string;
  exercises: Exercise[];
  setRecords: SetRecord[];
  isActive: boolean;
};

export function SessionExerciseList({
  workoutId,
  sessionId,
  exercises,
  setRecords,
  isActive,
}: SessionExerciseListProps) {
  if (exercises.length === 0) {
    return (
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Nenhum exercício cadastrado</CardTitle>
          <CardDescription>
            Adicione exercícios ao treino antes de registrar séries.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const setCountByExercise = setRecords.reduce<Record<string, number>>(
    (counts, set) => {
      counts[set.exerciseId] = (counts[set.exerciseId] ?? 0) + 1;
      return counts;
    },
    {},
  );

  return (
    <ul className="flex w-full max-w-lg flex-col gap-3">
      {exercises.map((exercise) => {
        const setCount = setCountByExercise[exercise.id] ?? 0;

        return (
          <li key={exercise.id}>
            <Link
              href={`/workouts/${workoutId}/sessions/${sessionId}/exercises/${exercise.id}`}
            >
              <Card className="py-4 transition-colors hover:bg-muted/50">
                <CardContent className="flex items-center justify-between gap-4 px-6 py-0">
                  <span className="font-medium">{exercise.name}</span>
                  <span className="text-sm text-muted-foreground">
                    {setCount === 0
                      ? isActive
                        ? "Registrar séries"
                        : "Sem séries"
                      : isActive
                        ? `${setCount} série${setCount === 1 ? "" : "s"}`
                        : `Ver ${setCount} série${setCount === 1 ? "" : "s"}`}
                  </span>
                </CardContent>
              </Card>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
