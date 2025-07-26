"use client";

import {
  createContext,
  useEffect,
  useState
} from "react";
import {
  usePathname,
  useRouter
} from "next/navigation";
import { Dictionary } from "@/lib/dictionaries";

type Language = "en" | "th";

type DotNotation<T, K extends keyof T = keyof T> = K extends string
  ? T[K] extends Record<string, unknown>
    ? T[K] extends string
      ? K
      : `${K}.${DotNotation<T[K]>}`
    : K
  : never;

type DictionaryKeys = DotNotation<Dictionary>;

interface Props {
  children: React.ReactNode;
  initialLanguage: Language;
  dictionary: Dictionary;
}

type InternationalType = {
  isLoading: boolean;
  language: Language;
  onChange: (lang: Language) => void;
  t: (key: DictionaryKeys) => string;
}
export const InternationalContext = createContext<InternationalType | undefined>(undefined);

export const InternationalProvider = ({ children, initialLanguage, dictionary }: Props) => {
  const router = useRouter();
  const pathname = usePathname();

  const [language, setLanguage] = useState<Language>(initialLanguage);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("preferred-language", language);
    }
  }, [language]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedLanguage = localStorage.getItem("preferred-language") as Language;
      if (savedLanguage && savedLanguage !== initialLanguage) {
        setLanguage(savedLanguage);
      }
    }
  }, [initialLanguage]);

  const onChange = (newLanguage: Language) => {
    if (newLanguage === language) return;

    setIsLoading(true);
    setLanguage(newLanguage);

    const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}/, "") || "/";
    const newPath = `/${newLanguage}${pathWithoutLocale}`;

    router.push(newPath);

    setTimeout(() => setIsLoading(false), 300);
  }

  const t = (key: DictionaryKeys): string => {
    const keys = key.split(".");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let value: any = dictionary;

    for (const k of keys) {
      if (value && typeof value === "object" && k in value) {
        value = value[k];
      } else {
        return key; 
      }
    }

    return typeof value === "string" ? value : key;
  };

  return (
    <InternationalContext.Provider value={{ language, isLoading, onChange, t }}>
      {children}
    </InternationalContext.Provider>
  );
}