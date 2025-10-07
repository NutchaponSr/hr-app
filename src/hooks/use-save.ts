"use client";

import { parseAsBoolean, useQueryState } from "nuqs";

export const useSave = () => {
  const [save, setSave] = useQueryState("save", parseAsBoolean.withDefault(false));

  return { save, setSave };
}