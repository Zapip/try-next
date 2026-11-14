import { getInitials, getReadableTextColor } from "@/lib/playerColors";

export default function PlayerAvatar({ name, color, size = "md" }) {
  const sizeClass = size === "lg" ? "h-12 w-12" : "h-10 w-10";

  return (
    <span
      className={`avatar ${sizeClass}`}
      style={{ backgroundColor: color, color: getReadableTextColor(color) }}
      aria-hidden="true"
    >
      {getInitials(name)}
    </span>
  );
}
