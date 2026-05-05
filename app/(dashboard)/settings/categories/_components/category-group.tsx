import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import CategoryItem from "./category-item";
import { Plus } from "lucide-react";
import { Category, TransactionType } from "@/lib/generated/prisma/client";
import { Button } from "@/components/ui/button";
import {
  transactionTypeTitlePlural,
  transactionTypeTitleSingular,
} from "@/lib/constants";
import AddCategoryForm from "./add-form";
import Drawer from "@/components/drawer";
import { useState } from "react";

type CategoryGroupProps = {
  type: TransactionType;
  categories: Category[];
};

export default function CategoryGroup({
  type,
  categories,
}: CategoryGroupProps) {
  const filteredCategories = categories.filter(
    (category) => category.type === type
  );

  const [addDrawerOpen, setAddDrawerOpen] = useState(false);

  return (
    <>
      <AccordionItem value={type} key={filteredCategories.length}>
        <AccordionTrigger className="cursor-pointer">
          {transactionTypeTitlePlural[type]}
        </AccordionTrigger>
        <AccordionContent>
          {filteredCategories.map((category) => (
            <CategoryItem
              icon={category.icon}
              name={category.name}
              id={category.id}
              key={category.id}
            />
          ))}

          <Button
            variant="ghost"
            className="w-full cursor-pointer"
            onClick={() => {
              setAddDrawerOpen(true);
            }}
          >
            <Plus /> Lägg till{" "}
            {transactionTypeTitleSingular[type].toLowerCase()}
          </Button>
        </AccordionContent>
      </AccordionItem>

      <Drawer
        open={addDrawerOpen}
        onOpenChange={setAddDrawerOpen}
        title="Ny kategori"
        description="Lägg till ny kategori"
      >
        <AddCategoryForm onOpenChange={setAddDrawerOpen} categoryType={type} />
      </Drawer>
    </>
  );
}
