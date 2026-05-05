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
import CategoryEditForm from "./edit-form";
import { Category } from "@/lib/generated/prisma/client";
import Drawer from "@/components/drawer";
import { useState } from "react";

type CategoryItemProps = {
  item: Category;
};

export default function CategoryItem({ item }: CategoryItemProps) {
  const [editDrawerOpen, setEditDrawerOpen] = useState(false);

  return (
    <>
      <Item onClick={() => setEditDrawerOpen(true)} className="cursor-pointer">
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
      <Drawer
        open={editDrawerOpen}
        onOpenChange={setEditDrawerOpen}
        title="Redigera kategori"
        description="Redigera namn, färg, typ eller ikon"
      >
        <CategoryEditForm category={item} onOpenChange={setEditDrawerOpen} />
      </Drawer>
    </>
  );
}
