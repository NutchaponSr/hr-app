"use client";

import { parseAsInteger, useQueryState } from "nuqs";

export const useYear = () => {
  const [year, setYear] = useQueryState("year", parseAsInteger.withDefault(new Date().getFullYear()));

  return { year, setYear };
}