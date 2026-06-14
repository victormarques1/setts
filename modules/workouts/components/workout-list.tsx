import Link from "next/link";

import type { Workout } from "@/app/generated/prisma/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type WorkoutListProps = {
  workouts: Workout[];
};

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
              <CardContent className="flex min-h-11 items-center px-4 py-0 sm:px-6">
                <span className="min-w-0 truncate font-medium">{workout.name}</span>
              </CardContent>
            </Card>
          </Link>
        </li>
      ))}
    </ul>
  );
}
