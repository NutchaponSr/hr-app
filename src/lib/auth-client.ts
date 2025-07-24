import { 
  adminClient, 
  inferAdditionalFields, 
  usernameClient 
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/client";

import { env } from "@/env";

import { auth } from "@/lib/auth";
import { ac, roles } from "@/lib/permissions";

export const authClient = createAuthClient({
  baseURL: env.NEXT_PUBLIC_APP_URL,
  plugins: [
    adminClient({ ac, roles }),
    inferAdditionalFields<typeof auth>(),
    usernameClient(),
  ],
});