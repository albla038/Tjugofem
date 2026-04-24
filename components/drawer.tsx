import { ReactNode } from "react";
import {
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  Drawer as DrawerPrimitive,
  DrawerTitle,
} from "./ui/drawer";

type DrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  children: ReactNode;
  drawerAction?: ReactNode;
};

export default function Drawer({
  open,
  onOpenChange,
  title,
  description,
  children,
  drawerAction,
}: DrawerProps) {
  return (
    <DrawerPrimitive open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        {drawerAction ? (
          // Render in flex-row layout if drawerAction is provided
          <div className="flex items-start justify-between p-4">
            <div className="grid gap-0.5">
              <DrawerTitle>{title}</DrawerTitle>
              <DrawerDescription>{description}</DrawerDescription>
            </div>

            {drawerAction}
          </div>
        ) : (
          <DrawerHeader>
            <DrawerTitle>{title}</DrawerTitle>
            <DrawerDescription>{description}</DrawerDescription>
          </DrawerHeader>
        )}
        <div className="p-4 pt-0">{children}</div>
      </DrawerContent>
    </DrawerPrimitive>
  );
}
