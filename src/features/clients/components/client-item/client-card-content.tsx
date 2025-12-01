"use client";

import { CardContent } from "@/components/ui/card";
import clsx from "clsx";
import { LucideMail, LucidePhone } from "lucide-react";

type ClientCardContentProps = {
  email: string | null;
  phone: string | null;
};

export const ClientCardContent = ({ email, phone }: ClientCardContentProps) => {
  return (
    <CardContent>
      <ul className={clsx("whitespace-break-spaces flex flex-col gap-y-2")}>
        <li className="flex items-center gap-x-2">
          <LucideMail className="h-4 w-4 text-muted-foreground" />
          <span>{email || "No proporcionado"}</span>
        </li>
        <li className="flex items-center gap-x-2">
          <LucidePhone className="h-4 w-4 text-muted-foreground" />
          <span>{phone || "No proporcionado"}</span>
        </li>
      </ul>
    </CardContent>
  );
};
