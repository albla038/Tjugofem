"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { authClient } from "@/lib/auth-client";
import { User } from "better-auth";
import { LogOut, MoreVertical } from "lucide-react";
import { redirect } from "next/navigation";

type NavUserProps = {
  user: User;
};

export default function NavUser({ user }: NavUserProps) {
  async function logOut() {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => redirect("/login"),
      },
    });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Item variant="outline" className="cursor-pointer" size="xs">
          <ItemMedia>
            <Avatar className="size-8">
              <AvatarImage
                src={user.image ?? `https://avatar.vercel.sh/${user.email}`}
              />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
          </ItemMedia>
          <ItemContent className="line-clamp-1">
            <ItemTitle className="truncate">{user.name}</ItemTitle>
            <ItemDescription className="truncate">{user.email}</ItemDescription>
          </ItemContent>
          <ItemActions>
            <MoreVertical className="size-4" />
          </ItemActions>
        </Item>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-fit" align="end">
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={logOut} className="cursor-pointer">
            <LogOut /> Logga ut
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
