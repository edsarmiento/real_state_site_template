import { assertIntegerId, proxyToApi } from "@/lib/api-proxy";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const invalid = assertIntegerId(id);
  if (invalid) return invalid;

  const body = await request.text();
  return proxyToApi(`/api/v1/listings/${id}/photos/reorder`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body,
  });
}
