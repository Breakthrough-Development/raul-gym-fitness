"use client";

import { CardHeader, CardTitle } from "@/components/ui/card";
import { LucideUser } from "lucide-react";

type ClientCardHeaderProps = {
  firstName: string;
  lastName: string | null;
};

export const ClientCardHeader = ({
  firstName,
  lastName,
}: ClientCardHeaderProps) => {
  return (
    <CardHeader>
      <CardTitle className="flex gap-x-2">
        <LucideUser className="h-4 w-4" />
        {firstName} {lastName}
      </CardTitle>
    </CardHeader>
  );
};
