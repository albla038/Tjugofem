"use client";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth-client";
import { useTransition } from "react";

export default function LoginButton() {
  const [isPending, startTransition] = useTransition();

  function loginWithGoogle() {
    startTransition(async () => {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/dashboard",
        // TODO: Implement
        // errorCallbackURL
        // newUserCallbackURL
      });
    });
  }

  return (
    <Button onClick={loginWithGoogle} className="w-full" disabled={isPending}>
      {isPending ? (
        <>
          <Spinner /> Loggar in...
        </>
      ) : (
        "Logga in"
      )}
    </Button>
  );
}
