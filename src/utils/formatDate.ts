export function formatDate(date: string | undefined) {
  return date
    ? new Date(date).toLocaleString("es-DO", {
        weekday: "long",
        day: "numeric",
        year: "numeric",
        month: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true, // keeps a. m. / p. m.
      })
    : "N/A";
}
