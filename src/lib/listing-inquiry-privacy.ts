export function isPrivacyAccepted(value: FormDataEntryValue | null): boolean {
  return value === "on" || value === "true" || value === "1";
}
