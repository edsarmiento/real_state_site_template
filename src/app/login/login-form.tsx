"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import { AuthPageShell } from "@/components/auth-page-shell";
import { Button, ErrorBanner, PasswordField, TextField } from "@/components/ui";
import { parseApiFailureMessage } from "@/lib/validation";

import type { SiteBranding } from "@/lib/site-config-types";

export function LoginForm({
  siteName,
  siteTagline,
  siteLogoUrl,
  primaryColor,
  showPoweredBy,
  styledLayout = true,
}: SiteBranding & { styledLayout?: boolean }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const authError = searchParams.get("auth");
  const nextPath = searchParams.get("next") || "/listings";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(() => {
    if (authError === "expired") return "Tu sesión expiró. Vuelve a iniciar sesión.";
    if (authError === "no_access") {
      return "Tu usuario no tiene acceso a administrar este sitio.";
    }
    return null;
  });
  const [pending, setPending] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setPending(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        redirect_to?: string;
        message?: string;
        error?: string;
      };
      if (!res.ok) {
        setError(parseApiFailureMessage(data));
        return;
      }
      const destination =
        typeof data.redirect_to === "string" && data.redirect_to.startsWith("/")
          ? data.redirect_to
          : nextPath.startsWith("/") && !nextPath.startsWith("//")
            ? nextPath
            : "/listings";
      router.push(destination);
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  return (
    <AuthPageShell
      title="Iniciar sesión"
      description="Accede para administrar anuncios y leads."
      siteName={siteName}
      siteTagline={siteTagline}
      siteLogoUrl={siteLogoUrl}
      primaryColor={primaryColor}
      showPoweredBy={showPoweredBy}
      styledLayout={styledLayout}
    >
      <form className="flex flex-col gap-4" onSubmit={onSubmit}>
        <TextField
          id="email"
          name="email"
          type="email"
          label="Correo electrónico"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <PasswordField
          id="password"
          name="password"
          label="Contraseña"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error ? <ErrorBanner>{error}</ErrorBanner> : null}

        <Button type="submit" disabled={pending} className="mt-1 w-full py-2.5">
          {pending ? "Entrando…" : "Entrar"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-zinc-600">
        <Link href="/" className="font-medium text-zinc-800 underline underline-offset-2">
          Volver al catálogo
        </Link>
      </p>
    </AuthPageShell>
  );
}
