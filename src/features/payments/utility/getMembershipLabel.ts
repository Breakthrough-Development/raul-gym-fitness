"use client";
import { MembershipStatus } from "@prisma/client";

export const getMembershipLabel = (status: MembershipStatus): string => {
  switch (status) {
    case MembershipStatus.DAILY:
      return "Diario";
    case MembershipStatus.MONTHLY:
      return "Mensual";
    default:
      return status;
  }
};
