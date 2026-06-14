import { getCurrentUserId } from "@/lib/current-user";
import { CompletedSessionList } from "@/modules/sessions/components/completed-session-list";
import { sessionService } from "@/modules/sessions/services/session.service";

export default async function HistoryPage() {
  const userId = await getCurrentUserId();
  const sessions = await sessionService.listCompletedByUserId(userId);

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-8 px-6 py-12">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight">Histórico</h1>
        <p className="text-muted-foreground">
          Treinos finalizados com data de conclusão.
        </p>
      </div>
      <CompletedSessionList sessions={sessions} />
    </div>
  );
}
