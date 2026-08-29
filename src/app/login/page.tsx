import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "./login-form";
import { LoginLoading } from "./login-loading";

export const metadata: Metadata = {
  title: "Iniciar sesión",
};

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginLoading />}>
      <LoginForm />
    </Suspense>
  );
}
