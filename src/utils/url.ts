import { clientEnv } from "@/env.client";

export const getBaseUrl = () => {
  // Use process.env.NODE_ENV directly to avoid importing server secrets
  const environment = process.env.NODE_ENV;

  const baseUrl =
    environment === "development"
      ? "http://localhost:3000"
      : `https://${clientEnv.NEXT_PUBLIC_VERCEL_URL}`;

  return baseUrl;
};
