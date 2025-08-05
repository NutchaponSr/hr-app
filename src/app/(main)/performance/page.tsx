import { headers } from "next/headers";

import { auth } from "@/lib/auth";

const Page = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <div className="text-primary">
      Performance
      <pre className="text-xs">
        {JSON.stringify(session, null, 2)}
      </pre>
    </div>
  );
}

export default Page;