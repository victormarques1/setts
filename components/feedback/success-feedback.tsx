type SuccessFeedbackProps = {
  message: string;
};

export function SuccessFeedback({ message }: SuccessFeedbackProps) {
  return (
    <p className="text-sm font-medium text-primary" role="status">
      {message}
    </p>
  );
}
