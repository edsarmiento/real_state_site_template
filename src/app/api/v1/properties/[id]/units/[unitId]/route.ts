import { assertIntegerId, proxyToApi, readJsonBody } from "@/lib/api-proxy";

type RouteContext = { params: Promise<{ id: string; unitId: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const { id, unitId } = await context.params;
  const invalidProperty = assertIntegerId(id);
  if (invalidProperty) return invalidProperty;
  const invalidUnit = assertIntegerId(unitId);
  if (invalidUnit) return invalidUnit;

  return proxyToApi(`/api/v1/properties/${id}/units/${unitId}`);
}

export async function PATCH(request: Request, context: RouteContext) {
  const { id, unitId } = await context.params;
  const invalidProperty = assertIntegerId(id);
  if (invalidProperty) return invalidProperty;
  const invalidUnit = assertIntegerId(unitId);
  if (invalidUnit) return invalidUnit;

  const parsed = await readJsonBody(request);
  if (!parsed.ok) return parsed.response;

  return proxyToApi(`/api/v1/properties/${id}/units/${unitId}`, {
    method: "PATCH",
    body: JSON.stringify(parsed.data),
  });
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { id, unitId } = await context.params;
  const invalidProperty = assertIntegerId(id);
  if (invalidProperty) return invalidProperty;
  const invalidUnit = assertIntegerId(unitId);
  if (invalidUnit) return invalidUnit;

  return proxyToApi(`/api/v1/properties/${id}/units/${unitId}`, {
    method: "DELETE",
  });
}
