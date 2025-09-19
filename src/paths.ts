import type { Route } from "next";

export const ticketsPath = () => "/tickets" as Route;
export const ticketPath = (ticketId: string) =>
  `${ticketsPath()}/${ticketId}` as Route;
export const ticketEditPath = (ticketId: string) =>
  `${ticketsPath()}/${ticketId}/edit` as Route;
export const homePath = () => "/" as Route;
