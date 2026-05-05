"use client";

import CategoryIcon from "@/components/category-icon";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { EllipsisIcon } from "lucide-react";

type CategoryItemProps = {
  name: string;
  icon: string | null;
  id: string;
};

export default function CategoryItem(item: CategoryItemProps) {
  return (
    <Item
      onClick={() => alert(`Clicked item ${item.name} in category list`)}
      className="cursor-pointer"
    >
      <ItemMedia>
        <CategoryIcon category={item} />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>{item.name}</ItemTitle>
      </ItemContent>
      <ItemActions>
        <EllipsisIcon className="size-4" />
      </ItemActions>
    </Item>
  );
}
