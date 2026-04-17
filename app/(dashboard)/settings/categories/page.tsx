import { fetchAllCategories } from "@/data/category/queries";
import CategoryList from "./_components/category-list";

export default async function CategorySettingsPage() {
  const categories = await fetchAllCategories();

  return (
    <div>
      <CategoryList categories={categories} />
    </div>
  );
}
