import { redirect } from "next/navigation";

export default function BudgetIndexPage() {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;

  redirect(`/budget/${year}/${month}`);
}
