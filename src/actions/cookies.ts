"use server";

import { cookies } from "next/headers";

export const getCookieByKey = async (key: string): Promise<string | null> => {
  const cookie = (await cookies()).get(key);

  if (!cookie) {
    return null;
  }

  return cookie.value;
};

export const setCookieByKey = async (
  key: string,
  value: string
): Promise<void> => {
  (await cookies()).set(key, value);
};

export const deleteCookieByKey = async (key: string): Promise<void> => {
  (await cookies()).delete(key);
};

export const consumeCookiedByKey = async (key: string) => {
  const message = await getCookieByKey(key);

  await deleteCookieByKey(key);

  return message;
};
