import { formatWeight } from "@/lib/format-weight";

type ProgressSet = {
  weight: number;
  reps: number;
};

export function formatProgressSet(
  { weight, reps }: ProgressSet,
  options?: { includeRepsLabel?: boolean },
): string {
  const includeRepsLabel = options?.includeRepsLabel ?? true;
  const formattedWeight = `${formatWeight(weight)}kg`;
  const repsPart = includeRepsLabel ? `${reps} reps` : String(reps);

  return `${formattedWeight} × ${repsPart}`;
}
