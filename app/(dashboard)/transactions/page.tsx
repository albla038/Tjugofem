import TransactionList from "@/app/(dashboard)/transactions/_components/transaction-list";
import { fetchAllCategories } from "@/data/category/queries";
import { fetchTransactions } from "@/data/transaction/queries";
import { requireUser } from "@/data/user/verify-user";

export default async function TransactionsPage() {
  await requireUser();

  const [transactions, categories] = await Promise.all([
    fetchTransactions(),
    fetchAllCategories(),
  ]);

  return (
    <main>
      <TransactionList transactions={transactions} categories={categories} />
    </main>
  );
}
