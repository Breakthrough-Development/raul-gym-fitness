"use server";

import { prisma } from "@/lib/prisma";
import { ticketsPath } from "@/paths";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const updateTicket = async (id: string, formData: FormData) => {
  const data = {
    title: formData.get("title") as string,
    content: formData.get("content") as string,
  };

  await prisma.ticket.update({
    where: { id },
    data: {
      title: data.title,
      content: data.content,
    },
  });

  revalidatePath(ticketsPath());
  redirect(ticketsPath());
};

export { updateTicket };
