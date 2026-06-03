import Header from "@/components/header";
import { Spinner } from "@/components/ui/spinner";

export default function BudgetLoader() {
  return (
    <main className="flex h-svh flex-col justify-between">
      <Header>
        <h1 className="font-bold">Budget</h1>
        <Spinner />
      </Header>
    </main>
  );
}
