import { redirect } from "next/navigation";

type NewExercisePageProps = {
  params: Promise<{ workoutId: string }>;
};

export default async function NewExercisePage({ params }: NewExercisePageProps) {
  const { workoutId } = await params;
  redirect(`/workouts/${workoutId}`);
}
