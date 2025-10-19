import { hashToken } from "@/utils/crypto";
import { prisma } from "./prisma";

const SESSION_REFRESH_INTERVAL_MS = 1000 * 60 * 60 * 24 * 15; // 15 DAYS
const SESSION_MAX_DURATION_MS = SESSION_REFRESH_INTERVAL_MS * 2; // 30 DAYS

export const createSession = async (sessionToken: string, userId: string) => {
  const sessionId = hashToken(sessionToken);

  const session = {
    id: sessionId,
    usuarioId: userId,
    expira: new Date(Date.now() + SESSION_MAX_DURATION_MS),
  };

  await prisma.sesion.create({
    data: session,
  });

  return session;
};

export const validateSession = async (sessionToken: string) => {
  const sessionId = hashToken(sessionToken);

  // failing here
  const result = await prisma.sesion.findUnique({
    where: {
      id: sessionId,
    },
    include: {
      usuario: true,
    },
  });

  // if there is no session, return null
  if (!result) {
    return { user: null, session: null };
  }
  const { usuario, ...session } = result;

  // if the session is expired, delete it
  if (Date.now() >= session.expira.getTime()) {
    // or your ORM of choice
    await prisma.sesion.delete({
      where: {
        id: sessionId,
      },
    });

    return { user: null, session: null };
  }

  // if 15 days are left until the session expires, refresh the session
  if (Date.now() >= session.expira.getTime() - SESSION_REFRESH_INTERVAL_MS) {
    session.expira = new Date(Date.now() + SESSION_MAX_DURATION_MS);
    await prisma.sesion.update({
      where: {
        id: sessionId,
      },
      data: {
        expira: session.expira,
      },
    });
  }

  return { user: usuario, session };
};

export const invalidateSession = async (sessionId: string) => {
  await prisma.sesion.delete({
    where: {
      id: sessionId,
    },
  });
};
