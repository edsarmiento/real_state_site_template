/** Common IANA timezones for MX workspaces (Mi Cuenta). */
export const WORKSPACE_TIMEZONES = [
  { value: "America/Mexico_City", label: "Ciudad de México (Centro)" },
  { value: "America/Cancun", label: "Cancún (Sureste)" },
  { value: "America/Merida", label: "Mérida" },
  { value: "America/Monterrey", label: "Monterrey" },
  { value: "America/Mazatlan", label: "Mazatlán (Pacífico)" },
  { value: "America/Tijuana", label: "Tijuana (Noroeste)" },
  { value: "America/Hermosillo", label: "Hermosillo" },
  { value: "America/Chihuahua", label: "Chihuahua" },
  { value: "America/Ojinaga", label: "Ojinaga" },
  { value: "UTC", label: "UTC" },
] as const;

export function timezoneOptionsFor(current: string) {
  const known = WORKSPACE_TIMEZONES.some((z) => z.value === current);
  if (known || !current) return [...WORKSPACE_TIMEZONES];
  return [
    { value: current, label: `${current} (actual)` },
    ...WORKSPACE_TIMEZONES,
  ];
}
