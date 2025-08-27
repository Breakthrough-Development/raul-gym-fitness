import type { Route } from "next";

export const ticketsPath = () => "/tickets" as Route    ;
export const ticketPath = (ticketId: string) => `/tickets/${ticketId}` as Route;
export const homePath = () => "/" as Route;
