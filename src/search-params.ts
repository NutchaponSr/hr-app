import { 
  createLoader, 
  parseAsInteger, 
  parseAsStringEnum
 } from "nuqs/server";

import { Period } from "@/generated/prisma";


export const searchParams = {
  year: parseAsInteger.withDefault(new Date().getFullYear()),
  period: parseAsStringEnum<Period>(Object.values(Period)).withDefault(Period.IN_DRAFT),
}

export const loadSearchParams = createLoader(searchParams);