export function formatProgressDate(date: string) {
  const [year, month, day] = date.split("-").map(Number);

  return new Intl.DateTimeFormat("pt-BR").format(
    new Date(year, month - 1, day),
  );
}

export function formatProgressDateShort(date: string) {
  const [year, month, day] = date.split("-").map(Number);

  return new Intl.DateTimeFormat("pt-BR", {
    day: "numeric",
    month: "short",
  })
    .format(new Date(year, month - 1, day))
    .replace(".", "");
}
