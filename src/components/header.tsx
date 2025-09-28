"use client";
import { Button, buttonVariants } from "@/components/ui/button";
import { signOut } from "@/features/auth/actions/sign-out";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { homePath, signInPath, signUpPath } from "@/paths";
import { LucideKanban, LucideLogOut } from "lucide-react";
import Link from "next/link";
import { SubmitButton } from "./form/submit-button";
import { ThemeSwitcher } from "./theme/theme-switcher";

const Header = () => {
  const { isFetched, user } = useAuth();

  if (!isFetched) {
    return null;
  }

  const navItems = user ? (
    <li>
      <form action={signOut}>
        <SubmitButton label="Sign Out" icon={<LucideLogOut />} />
      </form>
    </li>
  ) : (
    <>
      <li>
        <Link
          href={signUpPath()}
          className={buttonVariants({ variant: "outline" })}
        >
          Sign Up
        </Link>
      </li>
      <li>
        <Link
          href={signInPath()}
          className={buttonVariants({ variant: "outline" })}
        >
          Sign In
        </Link>
      </li>
    </>
  );
  return (
    <header>
      <nav>
        <ul className="animate-header-from-top supports-backdrop-blur:bg-background/60 fixed left-0 right-0 top-0 z-20 border-b bg-background/95 backdrop-blur w-full flex py-2.5 px-5 justify-between">
          <li>
            <Button asChild variant="ghost">
              <Link href={homePath()}>
                <LucideKanban />
                <h1 className="text-lg font-bold">TicketBounty</h1>
              </Link>
            </Button>
          </li>
          <div className="flex items-center gap-2">
            <li>
              <ThemeSwitcher />
            </li>
            {navItems}
          </div>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
