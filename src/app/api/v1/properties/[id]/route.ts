import { assertIntegerId, proxyToApi, readJsonBody } from "@/lib/api-proxy";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const invalid = assertIntegerId(id);
  if (invalid) return invalid;

  return proxyToApi(`/api/v1/properties/${id}`);
}

export async function PATCH(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const invalid = assertIntegerId(id);
  if (invalid) return invalid;

  const parsed = await readJsonBody(request);
  if (!parsed.ok) return parsed.response;

  return proxyToApi(`/api/v1/properties/${id}`, {
    method: "PATCH",
    body: JSON.stringify(parsed.data),
  });
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const invalid = assertIntegerId(id);
  if (invalid) return invalid;

  return proxyToApi(`/api/v1/properties/${id}`, { method: "DELETE" });
}
