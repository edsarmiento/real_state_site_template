import { proxyToApi, readJsonBody } from "@/lib/api-proxy";

export async function GET() {
  return proxyToApi("/api/v1/account");
}

export async function PATCH(request: Request) {
  const parsed = await readJsonBody(request);
  if (!parsed.ok) return parsed.response;

  return proxyToApi("/api/v1/account", {
    method: "PATCH",
    body: JSON.stringify(parsed.data),
  });
}
