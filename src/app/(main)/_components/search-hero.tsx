import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { getFirstNameFromFullName } from "@/lib/utils";

import { SearchCommand } from "./search-command";

export const SearchHero = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // TODO: Skeleton loading
  if (!session) {
    return redirect("/auth/sign-in");
  }

  const name = getFirstNameFromFullName(session.user.name);

  return (
    <section className="flex justify-between relative w-full isolation-auto items-center">
      <h1 className="text-2xl font-semibold leading-6 text-primary">
        Hi {name}, How can we help you?
      </h1>

      <SearchCommand />
    </section>
  );
}
