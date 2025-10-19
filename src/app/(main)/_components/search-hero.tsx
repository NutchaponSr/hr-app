import { getFirstNameFromFullName } from "@/lib/utils";

import { SearchCommand } from "./search-command";
import { authClient } from "@/lib/auth-client";
import { Skeleton } from "@/components/ui/skeleton";

export const SearchHero = () => {
  const session = authClient.useSession();

  const name = getFirstNameFromFullName(session.data?.user.name || "-");

  if (session.isPending) {
    return (
      <section className="flex justify-between relative w-full isolation-auto items-center min-h-25">
        <Skeleton className="w-100 h-8 rounded" />
        <Skeleton className="w-40 h-8 rounded" />
      </section>
    );
  }

  return (
    <section className="flex justify-between relative w-full isolation-auto items-center min-h-25">
      <h1 className="text-2xl font-semibold leading-6 text-primary">
        Hi {name}, How can we help you?
      </h1>

      <SearchCommand />
    </section>
  );
}
