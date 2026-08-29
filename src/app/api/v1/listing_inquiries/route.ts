import { proxyToApi } from "@/lib/api-proxy";

export async function GET(request: Request) {
  const qs = new URL(request.url).searchParams.toString();
  return proxyToApi(`/api/v1/listing_inquiries${qs ? `?${qs}` : ""}`);
}
