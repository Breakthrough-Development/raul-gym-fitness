"use server";

import { prisma } from "@/lib/prisma";
import { ticketsPath } from "@/paths";
import { revalidatePath } from "next/cache";

const createTicket = async (formData: FormData) => {
  // todo: implement ticket creation
  const data = {
    title: formData.get("title") as string,
    content: formData.get("content") as string,
    status: "OPEN",
  };
  console.log(data);

  await prisma.ticket.create({
    data: {
        title: data.title,
        content: data.content,
        status: "OPEN",
    }
  })

  revalidatePath(ticketsPath())
};

export { createTicket };
