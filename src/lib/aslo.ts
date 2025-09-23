import { prisma } from "./prisma";
import { hashToken } from "@/utils/crypto";

const SESSION_REFRESH_INTERVAL_MS = 1000 * 60 * 60 * 24 * 15; // 15 DAYS
const SESSION_MAX_DURATION_MS = SESSION_REFRESH_INTERVAL_MS * 2; // 30 DAYS

export const createSession = async (sessionToken: string, userId: string) => {
  const sessionId = hashToken(sessionToken);

  const session = {
    id: sessionId,
    userId,
    expiresAt: new Date(Date.now() + SESSION_MAX_DURATION_MS),
  };

  await prisma.session.create({
    data: session,
  });

  return session;
};

export const validateSession = async (sessionToken: string) => {
  const sessionId = hashToken(sessionToken);

  console.log("validateSession sessionId", sessionId);
  // failing here
  const result = await prisma.session.findUnique({
    where: {
      id: sessionId,
    },
    include: {
      user: true,
    },
  });

  console.log("not empty validateSession result", result);
  // if there is no session, return null
  if (!result) {
    return { user: null, session: null };
  }
  console.log("validateSession result", result);
  const { user, ...session } = result;

  // if the session is expired, delete it
  if (Date.now() >= session.expiresAt.getTime()) {
    // or your ORM of choice
    await prisma.session.delete({
      where: {
        id: sessionId,
      },
    });

    return { user: null, session: null };
  }

  // if 15 days are left until the session expires, refresh the session
  if (Date.now() >= session.expiresAt.getTime() - SESSION_REFRESH_INTERVAL_MS) {
    session.expiresAt = new Date(Date.now() + SESSION_MAX_DURATION_MS);
    await prisma.session.update({
      where: {
        id: sessionId,
      },
      data: {
        expiresAt: session.expiresAt,
      },
    });
  }

  return { user, session };
};

export const invalidateSession = async (sessionId: string) => {
  await prisma.session.delete({
    where: {
      id: sessionId,
    },
  });
};
