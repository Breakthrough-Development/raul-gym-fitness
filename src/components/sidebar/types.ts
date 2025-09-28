import { Route } from "next";

export type NavItem = {
  title: string;
  icon: React.ReactElement<{ className: string }>;
  href: Route;
};
