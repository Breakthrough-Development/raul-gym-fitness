import { env } from "@/env";
import { cookies } from "next/headers";

export const SESSION_COOKIE_NAME = "session";

export const setSessionCookie = async (
  sessionToken: string,
  expiresAt: Date
) => {
  const cookie = {
    name: SESSION_COOKIE_NAME,
    value: sessionToken,
    attributes: {
      httpOnly: true,
      sameSite: "lax" as const,
      secure: env.NODE_ENV === "production",
      path: "/",
      expires: expiresAt,
    },
  };

  (await cookies()).set(cookie.name, cookie.value, cookie.attributes);
};

export const deleteSessionCookie = async () => {
  // blank cookie
  const cookie = {
    name: SESSION_COOKIE_NAME,
    value: "",
    attributes: {
      httpOnly: true,
      sameSite: "lax" as const,
      secure: env.NODE_ENV === "production",
      path: "/",
      expires: 0,
    },
  };

  // set the blank cookie
  (await cookies()).set(cookie.name, cookie.value, cookie.attributes);
};
