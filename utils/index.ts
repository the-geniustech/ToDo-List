export type RelativeTimeOptions = {
  now?: Date;
  locale?: string;
  timeZone?: string;
};

export function formatRelativeDate(
  input: string | number | Date,
  opts: RelativeTimeOptions = { timeZone: "Africa/Lagos" }
): string {
  const date = new Date(input);
  if (isNaN(date.getTime())) throw new Error("Invalid date");

  const now = opts.now ?? new Date();
  const diffMs = now.getTime() - date.getTime();

  const toMonthDay = (d: Date, includeYear: boolean) =>
    new Intl.DateTimeFormat(opts.locale ?? "en-US", {
      month: "short",
      day: "numeric",
      ...(includeYear ? { year: "numeric" } : {}),
      ...(opts.timeZone ? { timeZone: opts.timeZone } : {}),
    }).format(d);

  // Future handling (if input is in the future)
  if (diffMs < 0) {
    const seconds = Math.ceil(-diffMs / 1000);
    if (seconds < 60)
      return seconds === 1 ? "in a second" : `in ${seconds} seconds`;
    const minutes = Math.ceil(seconds / 60);
    if (minutes < 60)
      return minutes === 1 ? "in a minute" : `in ${minutes} minutes`;
    const hours = Math.ceil(minutes / 60);
    if (hours < 24) return hours === 1 ? "in an hour" : `in ${hours} hours`;
    const days = Math.ceil(hours / 24);
    if (days <= 5) return days === 1 ? "in 1 day" : `in ${days} days`;
    const sameYear = now.getFullYear() === date.getFullYear();
    return toMonthDay(date, !sameYear);
  }

  // Past handling
  const seconds = Math.floor(diffMs / 1000);
  if (seconds < 60)
    return seconds <= 1 ? "a second ago" : `${seconds} seconds ago`;

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60)
    return minutes === 1 ? "a minute ago" : `${minutes} minutes ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return hours === 1 ? "an hour ago" : `${hours} hours ago`;

  const days = Math.floor(hours / 24);
  if (days <= 5) return days === 1 ? "1 day ago" : `${days} days ago`;

  const sameYear = now.getFullYear() === date.getFullYear();
  return toMonthDay(date, !sameYear);
}
