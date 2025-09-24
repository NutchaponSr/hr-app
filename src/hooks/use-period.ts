"use client";

import { useQueryState } from "nuqs";

import { Period } from "@/generated/prisma";

export const usePeriod = () => {
  const [period, setPeriod] = useQueryState<Period>("period", {
    parse: (value) => value as Period,
    serialize: (value) => value,
  });

  return {
    period,
    setPeriod,
  };
};