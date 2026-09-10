/** Remount key for uncontrolled YellowSearch controls bound to URL filters. */
export function yellowSearchRemountKey(filters: {
  city: string;
  propertyType: string;
  bedrooms: string;
}): string {
  return JSON.stringify([filters.city, filters.propertyType, filters.bedrooms]);
}
