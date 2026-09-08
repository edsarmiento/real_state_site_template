/** Keeps the last words on one line so titles do not orphan a single word. */
export function keepTrailingWordsTogether(title: string, count = 2): string {
  const words = title.trim().replace(/\s+/g, " ").split(" ").filter(Boolean);
  if (words.length === 0) return "";
  if (words.length <= count) return words.join("\u00a0");
  const head = words.slice(0, -count).join(" ");
  const tail = words.slice(-count).join("\u00a0");
  return `${head} ${tail}`;
}
