"use client";

import { RxGlobe } from "react-icons/rx";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { useLanguage } from "@/hooks/use-language";
import { LANGUAGES } from "@/constants";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./ui/button";

export const LanguageSelector = () => {
  const { language, onChange, isLoading, t } = useLanguage();

  const currentLanguage = LANGUAGES.find(lang => lang.code === language);

  return (
    <Select
      value={language}
      onValueChange={onChange}
      disabled={isLoading}
    >
      <SelectTrigger className={cn(buttonVariants({ variant: "ghost" }), "shadow-none border-none !px-2 !h-7 text-neutral font-normal")}>
        <SelectValue>
          <div className="flex items-center gap-2">
            <RxGlobe />
            <span>{currentLanguage?.name}</span>
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="w-60">
        {LANGUAGES.map((lang) => (
          <SelectItem key={lang.code} value={lang.code}>
            <div className="flex flex-col items-start">
              <span className="text-primary text-sm">{lang.name}</span>
              <span className="text-tertiary text-xs">{t(`lang.${lang.code}`)}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}