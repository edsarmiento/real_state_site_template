import { proxyToApi, readJsonBody } from "@/lib/api-proxy";

export async function GET() {
  return proxyToApi("/api/v1/properties");
}

export async function POST(request: Request) {
  const parsed = await readJsonBody(request);
  if (!parsed.ok) return parsed.response;

  return proxyToApi("/api/v1/properties", {
    method: "POST",
    body: JSON.stringify(parsed.data),
  });
}
