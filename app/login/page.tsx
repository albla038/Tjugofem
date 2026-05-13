import LoginButton from "@/app/login/_components/login-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { verifyUser } from "@/data/user/verify-user";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const user = await verifyUser();

  if (user) {
    redirect("/transactions");
  }

  return (
    <main className="flex h-svh items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            Välkommen tillbaka
          </CardTitle>
          <CardDescription>Fortsätt med Google</CardDescription>
        </CardHeader>
        <CardContent>
          <LoginButton />
        </CardContent>
      </Card>
    </main>
  );
}
