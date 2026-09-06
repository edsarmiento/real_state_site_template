export function themeNameFromLayoutKey(
  layoutKey: string,
): "default" | "luxury" | "orange" {
  const value = layoutKey.trim().toLowerCase();
  if (value === "deo" || value === "luxury") return "luxury";
  if (value === "orange") return "orange";
  return "default";
}
