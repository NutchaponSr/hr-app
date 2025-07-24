"use server";

import { headers } from "next/headers";
import { APIError } from "better-auth/api";

import { auth, ErrorCode } from "@/lib/auth";

export const signIn = async (
  emailOrUsername: string,
  password: string
) => {
  try {
    if (emailOrUsername.includes("@")) {
      await auth.api.signInEmail({
        headers: await headers(),
        body: {
          email: emailOrUsername,
          password,
        },
      });
    } else {
      await auth.api.signInUsername({
        headers: await headers(),
        body: {
          username: emailOrUsername,
          password,
        },
      });
    }

    return { error: null };
  } catch (error) {
    if (error instanceof APIError) {
      const errorCode = error.body ? (error.body.code as ErrorCode) : "UNKNOWN";

      switch (errorCode) {
        default: {
          return { error: error.message };
        }
      }
    }

    return { error: "🟥 Internal server error" };
  }
}