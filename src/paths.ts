import type { Route } from "next";

export const homePath = () => "/" as Route;
export const signUpPath = () => "/sign-up" as Route;
export const signInPath = () => "/sign-in" as Route;
export const passwordForgotPath = () => "/password-forgot" as Route;

export const accountProfilePath = () => "/account/profile" as Route;
export const accountPasswordPath = () => "/account/password" as Route;

export const dashboardPath = () => "/dashboard" as Route;
export const clientsPath = () => "/dashboard/client" as Route;
export const ClientPath = (clientId: string) =>
  `${clientsPath()}/${clientId}` as Route;
export const ClientEditPath = (clientId: string) =>
  `${ClientPath(clientId)}/edit` as Route;
export const paymentsPath = () => "/dashboard/payments" as Route;
export const paymentPath = (paymentId: string) =>
  `${paymentsPath()}/${paymentId}` as Route;
export const paymentsEditPath = (paymentId: string) =>
  `${paymentPath(paymentId)}/edit` as Route;
export const usersPath = () => "/dashboard/users" as Route;
export const notificationsPath = () => "/dashboard/notifications" as Route;
