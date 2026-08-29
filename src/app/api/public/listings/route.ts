import { proxyPublicToApi } from "@/lib/api-proxy";

export async function GET(request: Request) {
  const qs = new URL(request.url).searchParams.toString();
  return proxyPublicToApi(`/api/public/listings${qs ? `?${qs}` : ""}`);
}
