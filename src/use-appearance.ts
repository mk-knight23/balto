import { useEffect, useState } from "react";
import { readAppearance, resolveTheme, saveAppearance } from "./appearance";
function preferenceStorage() {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}
export function useAppearance() {
  const [appearance, setAppearance] = useState(() =>
    readAppearance(preferenceStorage()),
  );
  const [systemDark, setSystemDark] = useState(
    () => window.matchMedia("(prefers-color-scheme: dark)").matches,
  );
  const theme = resolveTheme(appearance.theme, systemDark);
  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const update = () => setSystemDark(media.matches);
    media.addEventListener("change", update);
    update();
    return () => media.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.dataset.effects = appearance.effects
      ? "on"
      : "off";
    document.documentElement.style.colorScheme = theme;
    saveAppearance(preferenceStorage(), appearance);
  }, [appearance, theme]);
  return {
    appearance,
    setAppearance,
    theme,
    toggleTheme: () =>
      setAppearance((v) => ({
        ...v,
        theme: theme === "dark" ? "light" : "dark",
      })),
  };
}
