export type ThemePreference = "light" | "dark" | "system";
export interface Appearance {
  theme: ThemePreference;
  effects: boolean;
}
export function readAppearance(
  storage: { getItem: (key: string) => string | null } | null,
): Appearance {
  try {
    const saved = storage?.getItem("balto-theme");
    return {
      theme: saved === "light" || saved === "dark" ? saved : "system",
      effects: storage?.getItem("balto-effects") !== "off",
    };
  } catch {
    return { theme: "system", effects: true };
  }
}
export function resolveTheme(
  preference: ThemePreference,
  systemDark: boolean,
): "light" | "dark" {
  return preference === "system" ? (systemDark ? "dark" : "light") : preference;
}
export function saveAppearance(
  storage: { setItem: (key: string, value: string) => void } | null,
  appearance: Appearance,
) {
  try {
    storage?.setItem("balto-theme", appearance.theme);
    storage?.setItem("balto-effects", appearance.effects ? "on" : "off");
  } catch {
    /* Private browser settings can prevent preference storage. */
  }
}
