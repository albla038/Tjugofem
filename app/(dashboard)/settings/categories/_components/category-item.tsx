"use client";

import CategoryIcon from "@/components/category-icon";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { EllipsisIcon, Trash2 } from "lucide-react";
import CategoryEditForm from "./edit-form";
import { Category } from "@/lib/generated/prisma/client";
import Drawer from "@/components/drawer";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import CategoryDeleteAlert from "./delete-alert";

type CategoryItemProps = {
  item: Category;
};

export default function CategoryItem({ item }: CategoryItemProps) {
  const [editDrawerOpen, setEditDrawerOpen] = useState(false);
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);

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
        drawerAction={
          <Button onClick={() => setDeleteAlertOpen(true)} variant={"ghost"}>
            <Trash2 className="text-destructive" />
          </Button>
        }
        title="Redigera kategori"
        description="Redigera namn, färg, typ eller ikon"
      >
        <CategoryEditForm category={item} onOpenChange={setEditDrawerOpen} />
      </Drawer>

      <CategoryDeleteAlert
        open={deleteAlertOpen}
        categoryId={item.id}
        onOpenChange={setDeleteAlertOpen}
        categoryName={item.name}
      />
    </>
  );
}
