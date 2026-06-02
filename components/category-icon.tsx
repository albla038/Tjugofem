import { CATEGORY_ICON_MAP } from "@/lib/category-icon-map";
import { cn, getContrastColor } from "@/lib/utils";

function stringToColor(str: string) {
  // Generate a hash from the input string
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  // Extract the red, green, and blue components from the hash and convert to hexadecimal
  let color = "#";
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  return color;
}

type CategoryIconProps = {
  category: {
    name: string;
    icon?: string;
    color?: string;
  };
  className?: string;
};

export default function CategoryIcon({
  category,
  className,
}: CategoryIconProps) {
  const backgroundColor = category.color || stringToColor(category.name);
  const textColor = getContrastColor(backgroundColor);

  const Icon =
    category.icon &&
    CATEGORY_ICON_MAP[category.icon as keyof typeof CATEGORY_ICON_MAP];

  return (
    <div
      className={cn(
        "flex size-10 shrink-0 items-center justify-center rounded-full border border-border text-sm",
        className
      )}
      style={{
        backgroundColor,
        color: textColor,
      }}
    >
      {Icon ? (
        <Icon className="size-4" />
      ) : (
        category.name.charAt(0).toUpperCase()
      )}
    </div>
  );
}
