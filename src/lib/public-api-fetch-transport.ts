/**
 * Classifies thrown values from `fetch` (not HTTP status codes).
 * JSON parse failures of response bodies are handled separately and must not
 * reach this helper.
 *
 * - `aborted`: AbortError / TimeoutError — caller should rethrow (no invented status)
 * - `network`: connect/DNS/fetch failures — may map to typed `{ ok:false, status:503 }`
 * - `unknown`: programming / unexpected — always rethrow
 */
export type PublicApiTransportKind = "aborted" | "network" | "unknown";

export function classifyPublicApiFetchError(
  error: unknown,
): PublicApiTransportKind {
  if (!error || typeof error !== "object") return "unknown";

  const name = "name" in error ? String(error.name) : "";
  if (name === "AbortError" || name === "TimeoutError") {
    return "aborted";
  }

  const message = "message" in error ? String(error.message) : "";
  const cause =
    "cause" in error && error.cause && typeof error.cause === "object"
      ? error.cause
      : null;
  const causeCode =
    cause && "code" in cause && cause.code != null ? String(cause.code) : "";
  const haystack = `${message} ${causeCode}`;

  if (
    /fetch failed|failed to fetch|networkerror|load failed/i.test(haystack) ||
    /ECONNREFUSED|ENOTFOUND|ETIMEDOUT|ECONNRESET|EAI_AGAIN|EHOSTUNREACH|UND_ERR_/i.test(
      haystack,
    )
  ) {
    return "network";
  }

  if (name === "TypeError" && /fetch/i.test(message)) {
    return "network";
  }

  return "unknown";
}

/** Only network transport failures use a synthetic HTTP-like status (503). */
export function publicApiNetworkFailureResult(): {
  ok: false;
  data: null;
  status: 503;
} {
  return { ok: false, data: null, status: 503 };
}
