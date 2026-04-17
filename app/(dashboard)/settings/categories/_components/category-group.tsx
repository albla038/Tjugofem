import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import CategoryItem from "./category-item";
import { House } from "lucide-react";
import { Category, TransactionType } from "@/lib/generated/prisma/client";

const transactionTypeTitle: Record<TransactionType, string> = {
  EXPENSE: "Utgifter",
  INCOME: "Inkomster",
  SAVING: "Sparande",
};

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

  return (
    <AccordionItem value={type}>
      <AccordionTrigger className="cursor-pointer">
        {transactionTypeTitle[type]}
      </AccordionTrigger>
      <AccordionContent>
        {filteredCategories.map((category) => (
          <CategoryItem
            icon={<House />}
            name={category.name}
            id={category.id}
            key={category.id}
          />
        ))}
      </AccordionContent>
    </AccordionItem>
  );
}
