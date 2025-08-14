import { parseAsInteger, createLoader } from "nuqs/server";

export const searchParams = {
  year: parseAsInteger.withDefault(new Date().getFullYear()),
}

export const loadSearchParams = createLoader(searchParams);