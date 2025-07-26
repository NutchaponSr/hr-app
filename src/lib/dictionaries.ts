import "server-only";

const dictionaries = {
  en: () => import("@/dictionaries/en.json").then((module) => module.default),
  th: () => import("@/dictionaries/th.json").then((module) => module.default),
}

export const getDictionary = async (locale: keyof typeof dictionaries) => {
  return dictionaries[locale]?.() ?? dictionaries.en();
}

export type Dictionary = Awaited<ReturnType<typeof getDictionary>>;