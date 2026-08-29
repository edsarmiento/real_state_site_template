import { proxyToApi, readJsonBody } from "@/lib/api-proxy";

export async function PATCH(request: Request) {
  const parsed = await readJsonBody(request);
  if (!parsed.ok) return parsed.response;

  return proxyToApi("/api/v1/users/me", {
    method: "PATCH",
    body: JSON.stringify(parsed.data),
  });
}
