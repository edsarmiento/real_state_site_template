import { proxyPublicToApi } from "@/lib/api-proxy";

type RouteContext = { params: Promise<{ slug: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const { slug } = await context.params;
  if (!slug?.trim()) {
    return Response.json({ error: "slug inválido" }, { status: 400 });
  }
  return proxyPublicToApi(`/api/public/listings/${encodeURIComponent(slug)}`);
}
