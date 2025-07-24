import { 
  hash,
  verify,
  type Options
} from "@node-rs/argon2";
import { betterAuth } from "better-auth";
import { username } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { APIError, createAuthMiddleware } from "better-auth/api";

import { prisma } from "@/lib/prisma";
import { VALID_DOMAINS } from "@/lib/utils";

const opts: Options = {
  memoryCost: 19456,
  timeCost: 2,
  outputLen: 32,
  parallelism: 1,
}

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
    autoSignIn: false,
    password: {
      hash: async (password) => {
        return await hash(password, opts);
      },
      verify: async ({ password, hash }) => {
        return await verify(hash, password, opts);
      },
    }
  },
  user: {
    additionalFields: {
      employeeId: {
        type: "string",
        required: false,
        input: false,
      },
      role: {
        type: ["USER", "ADMIN"],
        input: false,
      }
    }
  },
  advanced: {
    database: {
      generateId: false,
    },
  },
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path === "/sign-up/email") {
        const email = String(ctx.body.email);
        const domain = email.split("@")[1].toLowerCase();

        if (!VALID_DOMAINS().includes(domain)) {
          throw new APIError("BAD_REQUEST", { message: "Invalid email domain" });
        }

        return {
          context: {
            ...ctx,
          }
        }
      }
    }),
  },
  session: {
    expiresIn: 60 * 60 * 24 * 30, // 30 days
    cookieCache: {
      enabled: true,
      maxAge: 5 * 10,
    },
  },
  plugins: [
    nextCookies(),
    username(),
  ],
});

export type ErrorCode = keyof typeof auth.$ERROR_CODES | "UNKNOWN";