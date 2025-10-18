"use client";
import { Button, buttonVariants } from "@/components/ui/button";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { homePath, signInPath, signUpPath } from "@/paths";
import { LucideDumbbell } from "lucide-react";
import Link from "next/link";
import { AccountDropdown } from "./account-dropdown";
import { AnimatedThemeToggler } from "./ui/animated-theme-toggler";
import { ScrollProgress } from "./ui/scroll-progress";
import { SidebarTrigger } from "./ui/sidebar";
const Header = () => {
  const { isFetched, user } = useAuth();

  if (!isFetched) {
    return null;
  }

  const navItems = user ? (
    <li>
      <AccountDropdown user={user} />
    </li>
  ) : (
    <>
      <li>
        <Link
          href={signUpPath()}
          className={buttonVariants({ variant: "outline" })}
        >
          Registrarse
        </Link>
      </li>
      <li>
        <Link
          href={signInPath()}
          className={buttonVariants({ variant: "outline" })}
        >
          Iniciar sesión
        </Link>
      </li>
    </>
  );
  return (
    <header>
      <ScrollProgress className="top-[58px] bg-none dark:bg-white bg-black" />
      <nav>
        <ul className="animate-header-from-top supports-backdrop-blur:bg-background/60 fixed left-0 right-0 top-0 z-20 border-b bg-background/95 backdrop-blur w-full flex py-2.5 px-5 justify-between">
          <div className="flex items-center gap-2">
            {!!user && (
              <li>
                <SidebarTrigger className="cursor-pointer" />
              </li>
            )}
            <li>
              <Button asChild variant="ghost">
                <Link href={homePath()}>
                  <LucideDumbbell />
                  <h1 className="text-lg font-bold">Raul Gym Fitness</h1>
                </Link>
              </Button>
            </li>
          </div>
          <div className="flex items-center gap-2">
            <li>
              <AnimatedThemeToggler />
            </li>
            {navItems}
          </div>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
