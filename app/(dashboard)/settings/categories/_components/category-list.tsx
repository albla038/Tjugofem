"use client";

import { Category } from "@/lib/generated/prisma/client";
import { Accordion } from "@/components/ui/accordion";
import CategoryGroup from "./category-group";

type CategoryListProps = {
  categories: Category[];
};

export default function CategoryList({ categories }: CategoryListProps) {
  return (
    <div className="px-6">
      <Accordion type="multiple" defaultValue={["INCOME", "EXPENSE", "SAVING"]}>
        <CategoryGroup type={"INCOME"} categories={categories} />
        <CategoryGroup type={"EXPENSE"} categories={categories} />
        <CategoryGroup type={"SAVING"} categories={categories} />
      </Accordion>
    </div>
  );
}
