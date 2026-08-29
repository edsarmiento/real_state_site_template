import { proxyPublicToApi, readJsonBody } from "@/lib/api-proxy";

type RouteContext = { params: Promise<{ slug: string }> };

export async function POST(request: Request, context: RouteContext) {
  const { slug } = await context.params;
  if (!slug?.trim()) {
    return Response.json({ error: "slug inválido" }, { status: 400 });
  }

  const parsed = await readJsonBody(request);
  if (!parsed.ok) return parsed.response;

  return proxyPublicToApi(
    `/api/public/listings/${encodeURIComponent(slug)}/inquiries`,
    {
      method: "POST",
      body: JSON.stringify(parsed.data),
    },
  );
}
