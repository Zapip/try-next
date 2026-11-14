export const PLAYER_COLORS = [
  "#E05C5C",
  "#E07A2F",
  "#C9A227",
  "#5BAD6F",
  "#2A9D8F",
  "#3A7DC9",
  "#6A5ACD",
  "#A855A8",
  "#D45E8A",
  "#5C8A6E",
];

const INK = "#2C3E50";
const WHITE = "#FFFFFF";

function luminance(hex) {
  const channels = hex
    .replace("#", "")
    .match(/\w\w/g)
    .map((value) => parseInt(value, 16) / 255)
    .map((value) =>
      value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
    );

  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

function contrast(foreground, background) {
  const foregroundLum = luminance(foreground);
  const backgroundLum = luminance(background);
  const lighter = Math.max(foregroundLum, backgroundLum);
  const darker = Math.min(foregroundLum, backgroundLum);
  return (lighter + 0.05) / (darker + 0.05);
}

export function getPlayerColor(index) {
  return PLAYER_COLORS[index % PLAYER_COLORS.length];
}

export function getReadableTextColor(background) {
  return contrast(WHITE, background) >= contrast(INK, background) ? WHITE : INK;
}

export function getInitials(name = "") {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();

  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}
