import { fetchAllCategories } from "@/data/category/queries";
import CategoryList from "./_components/category-list";
import { requireUser } from "@/data/user/verify-user";

export default async function CategorySettingsPage() {
  await requireUser();

  const categories = await fetchAllCategories();

  return (
    <main>
      <CategoryList categories={categories} />
    </main>
  );
}
