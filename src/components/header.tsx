import Link from "next/link";
import { homePath, signInPath, signUpPath, ticketsPath } from "@/paths";
import { Button, buttonVariants } from "@/components/ui/button";
import { LucideKanban, LucideLogOut } from "lucide-react";
import { ThemeSwitcher } from "./theme/theme-switcher";
import { SubmitButton } from "./form/submit-button";
import { signOut } from "@/features/auth/actions/sign-out";

const Header = () => {
  const navItems = (
    <>
      <li>
        <Link
          href={ticketsPath()}
          className={buttonVariants({ variant: "outline" })}
        >
          Tickets
        </Link>
      </li>
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
      <li>
        <form action={signOut}>
          <SubmitButton label="Sign Out" icon={<LucideLogOut />} />
        </form>
      </li>
    </>
  );
  return (
    <header>
      <nav>
        <ul className="supports-backdrop-blur:bg-background/60 fixed left-0 right-0 top-0 z-20 border-b bg-background/95 backdrop-blur w-full flex py-2.5 px-5 justify-between">
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
