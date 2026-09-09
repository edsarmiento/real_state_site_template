import { proxyToApi } from "@/lib/api-proxy";

type RouteContext = { params: Promise<{ id: string }> };

export async function DELETE(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  if (!/^\d+$/.test(id)) {
    return Response.json({ error: "invalid_id" }, { status: 400 });
  }
  return proxyToApi(`/api/v1/listing_inquiries/${id}`, { method: "DELETE" });
}
