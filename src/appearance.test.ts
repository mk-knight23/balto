import { describe, it, expect } from "vitest";
import { readAppearance, resolveTheme, saveAppearance } from "./appearance";
describe("appearance preferences", () => {
  it("defaults to system theme and enabled gentle effects", () => {
    expect(readAppearance(null)).toEqual({ theme: "system", effects: true });
    expect(resolveTheme("system", true)).toBe("dark");
    expect(resolveTheme("system", false)).toBe("light");
  });
  it("honors explicit preference over device color scheme", () => {
    expect(resolveTheme("light", true)).toBe("light");
    expect(resolveTheme("dark", false)).toBe("dark");
  });
  it("ignores invalid stored values", () => {
    expect(readAppearance({ getItem: () => "<script>bad</script>" })).toEqual({
      theme: "system",
      effects: true,
    });
  });
  it("supports disabled effects without changing the theme", () => {
    expect(
      readAppearance({
        getItem: (k) => (k === "balto-theme" ? "dark" : "off"),
      }),
    ).toEqual({ theme: "dark", effects: false });
  });
  it("works when storage access is denied", () => {
    expect(
      readAppearance({
        getItem: () => {
          throw Error("denied");
        },
      }).theme,
    ).toBe("system");
    expect(() =>
      saveAppearance(
        {
          setItem: () => {
            throw Error("denied");
          },
        },
        { theme: "dark", effects: false },
      ),
    ).not.toThrow();
  });
  it("writes only appearance preferences", () => {
    const keys: string[] = [];
    saveAppearance(
      { setItem: (k, v) => keys.push(k + "=" + v) },
      { theme: "light", effects: true },
    );
    expect(keys).toEqual(["balto-theme=light", "balto-effects=on"]);
  });
});
