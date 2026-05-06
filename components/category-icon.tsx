import { CATEGORY_ICON_MAP } from "@/lib/category-icon-map";
import { cn } from "@/lib/utils";

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

function getContrastColor(hexColor: string) {
  const hex = hexColor.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  // Calculate perceived brightness (YIQ formula)
  const Y = (r * 299 + g * 587 + b * 114) / 1000;

  return Y >= 128 ? "var(--foreground)" : "var(--background)";
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
