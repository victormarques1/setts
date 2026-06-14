import { ErrorFeedback } from "@/components/feedback/error-feedback";
import { SuccessFeedback } from "@/components/feedback/success-feedback";

type FeedbackRegionProps = {
  error?: string | null;
  success?: string | null;
};

export function FeedbackRegion({ error, success }: FeedbackRegionProps) {
  const hasFeedback = Boolean(error) || Boolean(success);

  return (
    <div
      aria-live="polite"
      className={hasFeedback ? "min-h-5" : "sr-only"}
    >
      {error ? <ErrorFeedback message={error} /> : null}
      {success ? <SuccessFeedback message={success} /> : null}
    </div>
  );
}
