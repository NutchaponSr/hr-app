import { z } from "zod";
import { createEnv } from "@t3-oss/env-nextjs";

export const env = createEnv({
  server: {
    DATBASE_URL: z.url(),
    NODE_ENV: z.enum(["development", "test", "production"]),
  },
  experimental__runtimeEnv: {
    DATBASE_URL: process.env.DATBASE_URL,
    NODE_ENV: process.env.NODE_ENV,
  },
});