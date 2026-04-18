import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema/index.ts", // Optional for pull, but required for config validity
  out: "./drizzle-out", // The introspected files will be pushed here
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
