import { assertIntegerId, proxyMultipartToApi } from "@/lib/api-proxy";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const invalid = assertIntegerId(id);
  if (invalid) return invalid;
  return proxyMultipartToApi(`/api/v1/listings/${id}/photos`, request);
}
