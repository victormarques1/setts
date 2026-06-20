const BRASILIA_TIME_ZONE = "America/Sao_Paulo";

const brasiliaDateTimeOptions = {
  timeZone: BRASILIA_TIME_ZONE,
} as const;

export function formatSessionPerformedAt(date: Date): string {
  return new Intl.DateTimeFormat("pt-BR", {
    ...brasiliaDateTimeOptions,
    dateStyle: "long",
    timeStyle: "short",
  }).format(date);
}

export function formatSessionPerformedAtShort(date: Date): string {
  return new Intl.DateTimeFormat("pt-BR", {
    ...brasiliaDateTimeOptions,
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function formatSessionPerformedAtFull(date: Date): string {
  return new Intl.DateTimeFormat("pt-BR", {
    ...brasiliaDateTimeOptions,
    dateStyle: "full",
    timeStyle: "short",
  }).format(date);
}

export function formatLastSessionAt(date: Date): string {
  return new Intl.DateTimeFormat("pt-BR", {
    ...brasiliaDateTimeOptions,
    dateStyle: "medium",
  }).format(date);
}

export function formatDateOnlyBrasilia(date: Date): string {
  return new Intl.DateTimeFormat("en-CA", {
    ...brasiliaDateTimeOptions,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}
