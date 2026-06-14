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
      <Card className="w-full max-w-lg">
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
    <ul className="flex w-full max-w-lg flex-col gap-3">
      {workouts.map((workout) => (
        <li key={workout.id}>
          <Link href={`/workouts/${workout.id}`}>
            <Card className="py-4 transition-colors hover:bg-muted/50">
              <CardContent className="flex items-center justify-between gap-4 px-6 py-0">
                <span className="font-medium">{workout.name}</span>
              </CardContent>
            </Card>
          </Link>
        </li>
      ))}
    </ul>
  );
}
