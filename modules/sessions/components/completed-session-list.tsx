import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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

export function CompletedSessionList({ sessions }: CompletedSessionListProps) {
  if (sessions.length === 0) {
    return (
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Nenhum treino finalizado</CardTitle>
          <CardDescription>
            Quando você finalizar um treino, ele aparecerá aqui com a data de
            conclusão.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button render={<Link href="/workouts" />} nativeButton={false}>
            Ir para treinos
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <ul className="flex w-full max-w-lg flex-col gap-3">
      {sessions.map((session) => (
        <li key={session.id}>
          <Link
            href={`/workouts/${session.workoutId}/sessions/${session.id}`}
          >
            <Card className="py-4 transition-colors hover:bg-muted/50">
              <CardContent className="flex flex-col gap-1 px-6 py-0">
                <span className="font-medium">{session.workoutName}</span>
                <span className="text-sm text-muted-foreground">
                  {formatSessionDate(session.performedAt)}
                </span>
              </CardContent>
            </Card>
          </Link>
        </li>
      ))}
    </ul>
  );
}
