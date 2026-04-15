"use client";

import {
  Item,
  ItemActions,
  ItemContent,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { EllipsisIcon } from "lucide-react";
import { ReactNode } from "react";

type CategoryItemProps = {
  name: string;
  icon: ReactNode;
  id: string;
  onClick: (id: string) => void;
};

export default function CategoryItem({
  name,
  icon,
  id,
  onClick,
}: CategoryItemProps) {
  return (
    <Item onClick={() => onClick(id)}>
      <ItemMedia variant="icon">{icon}</ItemMedia>
      <ItemContent>
        <ItemTitle>{name}</ItemTitle>
      </ItemContent>
      <ItemActions>
        <EllipsisIcon className="size-4" />
      </ItemActions>
    </Item>
  );
}
