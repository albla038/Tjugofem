import LogoutButton from "@/app/logout/_components/logout-button";
import { requireUser } from "@/data/user/verify-user";

export default async function LogoutPage() {
  await requireUser();

  return (
    <main className="h-svh p-4">
      <LogoutButton />
    </main>
  );
}
