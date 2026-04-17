import TransactionList from "@/app/(dashboard)/transactions/_components/transaction-list";
import { fetchTransactions } from "@/data/transaction/queries";
import { requireUser } from "@/data/user/verify-user";

export default async function TransactionsPage() {
  await requireUser();

  const transactions = await fetchTransactions();

  return (
    <main>
      <TransactionList transactions={transactions} />
    </main>
  );
}
