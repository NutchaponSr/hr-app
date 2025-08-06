import { 
  hash,
  verify,
  type Options
} from "@node-rs/argon2";
import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { APIError, createAuthMiddleware } from "better-auth/api";
import { admin, username, customSession } from "better-auth/plugins";

import { prisma } from "@/lib/prisma";
import { VALID_DOMAINS } from "@/lib/utils";
import { ac, roles } from "@/lib/permissions";

import { UserRole } from "@/generated/prisma";
import { env } from "@/env";

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
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          return {
            data: {
              ...user,
              email: user.email === "t@somboon.co.th" ? undefined : user.email,
            }
          }
        }
      }
    }
  },
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 5,
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
        
        // Skip domain validation if email is empty or invalid
        if (email && email.includes("@")) {
          const domain = email.split("@")[1]?.toLowerCase();
          
          if (domain && !VALID_DOMAINS().includes(domain)) {
            throw new APIError("BAD_REQUEST", { message: "Invalid email domain" });
          }
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
    admin({
      ac,
      roles,
      defaultRole: UserRole.USER,
      adminRoles: [UserRole.ADMIN],
    }),
    customSession(async ({ user, session }) => {
      const userDb = await prisma.user.findUnique({
        where: {
          id: user.id,
        },
        include: {
          employee: true,
        },
      });

      if (!userDb) {
        throw new APIError("NOT_FOUND", { message: "User not found" });
      }

      return {
        user: {
          ...user,
          level: userDb.employee.level,
        },
        session,
      }
    }),
    nextCookies(),
    username(),
  ],
  trustedOrigins: [
    env.BETTER_AUTH_URL,
  ],
});

export type ErrorCode = keyof typeof auth.$ERROR_CODES | "UNKNOWN";