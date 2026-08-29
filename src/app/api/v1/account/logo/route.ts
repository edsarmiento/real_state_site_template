import { proxyMultipartToApi, proxyToApi } from "@/lib/api-proxy";

export async function POST(request: Request) {
  return proxyMultipartToApi("/api/v1/account/logo", request);
}

export async function DELETE() {
  return proxyToApi("/api/v1/account/logo", { method: "DELETE" });
}
