import { getCurrentUserId } from "@/lib/current-user";
import { CompletedSessionList } from "@/modules/sessions/components/completed-session-list";
import { sessionService } from "@/modules/sessions/services/session.service";

export default async function HistoryPage() {
  const userId = await getCurrentUserId();
  const sessions = await sessionService.listCompletedByUserId(userId);

  return (
    <div className="page-shell">
      <div className="flex flex-col gap-2">
        <h1 className="page-title">Histórico</h1>
        <p className="page-subtitle">
          Revise treinos finalizados e acompanhe sua consistência.
        </p>
      </div>
      <CompletedSessionList sessions={sessions} />
    </div>
  );
}
