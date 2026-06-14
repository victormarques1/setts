type ErrorFeedbackProps = {
  message: string;
};

export function ErrorFeedback({ message }: ErrorFeedbackProps) {
  return (
    <p className="text-sm text-destructive" role="alert">
      {message}
    </p>
  );
}
