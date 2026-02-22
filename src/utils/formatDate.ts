export function formatDate(date: string | undefined) {
  return date ? new Date(date).toLocaleString() : "N/A";
}
