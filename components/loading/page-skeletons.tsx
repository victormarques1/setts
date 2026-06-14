import { Skeleton } from "@/components/ui/skeleton";

function BackLinkSkeleton() {
  return <Skeleton className="h-11 w-24 rounded-lg" />;
}

function PageHeaderSkeleton({ subtitle = true }: { subtitle?: boolean }) {
  return (
    <div className="flex flex-col gap-2">
      <Skeleton className="h-8 w-48 max-w-full" />
      {subtitle ? <Skeleton className="h-4 w-64 max-w-full" /> : null}
    </div>
  );
}

function ListCardSkeleton() {
  return (
    <div className="list-card px-4 py-3.5">
      <div className="flex min-h-11 items-center justify-between gap-3">
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <Skeleton className="h-4 w-36 max-w-full" />
          <Skeleton className="h-3 w-28 max-w-full" />
        </div>
        <Skeleton className="h-8 w-20 shrink-0 rounded-lg" />
      </div>
    </div>
  );
}

function ListCardSkeletons({ count = 4 }: { count?: number }) {
  return (
    <ul className="flex w-full flex-col gap-2.5 px-0.5" aria-busy="true" aria-label="Carregando lista">
      {Array.from({ length: count }, (_, index) => (
        <li key={index}>
          <ListCardSkeleton />
        </li>
      ))}
    </ul>
  );
}

export function WorkoutsPageSkeleton() {
  return (
    <div className="page-shell">
      <PageHeaderSkeleton />
      <ListCardSkeletons count={5} />
    </div>
  );
}

export function WorkoutDetailPageSkeleton() {
  return (
    <div className="page-shell page-shell-sticky-bar">
      <div className="flex flex-col gap-4">
        <BackLinkSkeleton />
        <PageHeaderSkeleton />
      </div>
      <ListCardSkeletons count={4} />
      <Skeleton className="fixed-above-nav-bar mx-auto h-12 max-w-2xl rounded-xl" />
    </div>
  );
}

export function SessionPageSkeleton() {
  return (
    <div className="page-shell page-shell-sticky-bar">
      <div className="flex flex-col gap-4">
        <BackLinkSkeleton />
        <div className="flex items-start justify-between gap-3">
          <PageHeaderSkeleton />
          <Skeleton className="h-12 w-20 shrink-0 rounded-lg" />
        </div>
      </div>
      <ListCardSkeletons count={5} />
      <div className="fixed-above-nav-bar mx-auto flex w-full max-w-2xl flex-col gap-2.5">
        <Skeleton className="mx-auto h-4 w-40" />
        <Skeleton className="h-12 w-full rounded-xl" />
      </div>
    </div>
  );
}

export function SetLoggerPageSkeleton() {
  return (
    <div className="page-shell page-shell-sticky-form">
      <div className="flex flex-col gap-4">
        <BackLinkSkeleton />
        <div className="flex items-start justify-between gap-3">
          <PageHeaderSkeleton />
          <Skeleton className="h-12 w-20 shrink-0 rounded-lg" />
        </div>
      </div>
      <div className="flex w-full flex-col gap-2.5">
        <Skeleton className="h-3 w-32 px-0.5" />
        <ListCardSkeletons count={2} />
      </div>
      <div className="fixed-above-nav-form">
        <div className="list-card flex flex-col gap-4 px-4 py-5">
          <Skeleton className="h-6 w-24" />
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-20 rounded-xl" />
            <Skeleton className="h-20 rounded-xl" />
          </div>
          <Skeleton className="h-12 w-full rounded-xl" />
          <Skeleton className="h-12 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export function HistoryPageSkeleton() {
  return (
    <div className="page-shell">
      <PageHeaderSkeleton />
      <ListCardSkeletons count={6} />
    </div>
  );
}

export function ProgressPageSkeleton() {
  return (
    <div className="page-shell">
      <PageHeaderSkeleton />
      <Skeleton className="h-12 w-full rounded-xl" />
      <div className="flex gap-2 overflow-hidden">
        <Skeleton className="h-11 w-24 shrink-0 rounded-full" />
        <Skeleton className="h-11 w-28 shrink-0 rounded-full" />
        <Skeleton className="h-11 w-20 shrink-0 rounded-full" />
      </div>
      <ListCardSkeletons count={5} />
    </div>
  );
}

export function ProgressDetailSkeleton() {
  return (
    <div
      className="flex min-h-0 w-full min-w-0 flex-1 flex-col gap-5"
      aria-busy="true"
      aria-label="Carregando progressão"
    >
      <div className="flex flex-col gap-4">
        <BackLinkSkeleton />
        <div className="flex min-w-0 flex-col gap-2">
          <Skeleton className="h-8 w-48 max-w-full" />
          <Skeleton className="h-4 w-32 max-w-full" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Skeleton className="progress-metric-card h-20" />
        <Skeleton className="progress-metric-card h-20" />
        <Skeleton className="progress-metric-card col-span-2 h-20 sm:col-span-1" />
      </div>
      <Skeleton className="list-card h-44 w-full sm:h-52" />
    </div>
  );
}
