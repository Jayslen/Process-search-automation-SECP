export function parseDate(dateStr: string | undefined): string | undefined {
  if (!dateStr) return undefined;

  const [date, time] = dateStr.split(" ");

  const [day, month, year] = (date as string).split("/");

  const [hours, minutes] = (time as string).split(":");

  return new Date(
    Number(year),
    Number(month) - 1, // 👈 los meses empiezan en 0
    Number(day),
    Number(hours),
    Number(minutes),
  ).toString();
}
