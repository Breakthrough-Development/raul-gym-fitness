import type { Route } from "next";

export const ticketsPath = () => "/tickets" as Route;
export const ticketPath = (ticketId: string) =>
  `${ticketsPath()}/${ticketId}` as Route;
export const ticketEditPath = (ticketId: string) =>
  `${ticketsPath()}/${ticketId}/edit` as Route;
export const homePath = () => "/" as Route;
export const signUpPath = () => "/sign-up" as Route;
export const signInPath = () => "/sign-in" as Route;
export const passwordForgotPath = () => "/password-forgot" as Route;

export const accountProfilePath = () => "/account/profile" as Route;
export const accountPasswordPath = () => "/account/password" as Route;

export const dashboardPath = () => "/dashboard" as Route;
export const dashboardUsersPath = () => "/dashboard/users" as Route;
export const dashboardUserPath = (userId: string) =>
  `${dashboardUsersPath()}/${userId}` as Route;
export const dashboardUserEditPath = (userId: string) =>
  `${dashboardUsersPath()}/${userId}/edit` as Route;
export const paymentsPath = () => "/dashboard/payments" as Route;
export const paymentPath = (paymentId: string) =>
  `${paymentsPath()}/${paymentId}` as Route;
export const paymentsEditPath = (paymentId: string) =>
  `${paymentPath(paymentId)}/edit` as Route;
