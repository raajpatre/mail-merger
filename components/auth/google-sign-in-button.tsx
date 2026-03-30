"use client";

import { signIn } from "next-auth/react";

export function GoogleSignInButton() {
  return (
    <button
      className="btn btn-primary"
      onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
      type="button"
    >
      Continue with Google
    </button>
  );
}
