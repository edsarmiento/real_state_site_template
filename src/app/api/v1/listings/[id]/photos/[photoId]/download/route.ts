import { assertIntegerId, proxyToApi } from "@/lib/api-proxy";

type RouteContext = { params: Promise<{ id: string; photoId: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const { id, photoId } = await context.params;
  const invalid = assertIntegerId(id) ?? assertIntegerId(photoId);
  if (invalid) return invalid;
  return proxyToApi(`/api/v1/listings/${id}/photos/${photoId}/download`);
}
