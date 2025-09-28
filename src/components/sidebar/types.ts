import { Route } from "next";

export type NavItem = {
  separator?: boolean;
  title: string;
  icon: React.ReactElement<{ className: string }>;
  href: Route;
};
