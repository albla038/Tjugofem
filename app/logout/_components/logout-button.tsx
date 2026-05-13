"use client";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth-client";
import { redirect } from "next/navigation";
import { useTransition } from "react";

export default function LogoutButton() {
  const [isPending, startTransition] = useTransition();

  function logOut() {
    startTransition(async () => {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => redirect("/login"),
        },
      });
    });
  }

  return (
    <Button onClick={logOut} disabled={isPending}>
      {isPending ? (
        <>
          <Spinner /> Loggar ut...
        </>
      ) : (
        "Logga ut"
      )}
    </Button>
  );
}
