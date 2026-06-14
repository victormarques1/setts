import { cache } from "react";

import { sessionService } from "@/modules/sessions/services/session.service";

export const getCachedSessionForUser = cache((sessionId: string, userId: string) => {
  return sessionService.getByIdForUser(sessionId, userId);
});
