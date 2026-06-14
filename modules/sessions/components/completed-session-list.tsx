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
      <Card className="w-full">
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
    <ul className="flex w-full flex-col gap-3">
      {sessions.map((session) => (
        <li key={session.id}>
          <Link
            href={`/workouts/${session.workoutId}/sessions/${session.id}`}
            className="block"
          >
            <Card className="min-h-11 py-4 transition-colors hover:bg-muted/50 active:bg-muted/50">
              <CardContent className="flex min-h-11 flex-col justify-center gap-1 py-0">
                <span className="min-w-0 truncate font-medium">
                  {session.workoutName}
                </span>
                <span className="text-muted-foreground text-sm">
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
