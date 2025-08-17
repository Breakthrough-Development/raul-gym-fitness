import Link from "next/link";
import { homePath, ticketsPath } from "@/paths";
import type { Route } from "next";
import { Button } from "@/components/ui/button";
import { LucideKanban } from "lucide-react";

const Header = () => {
  return (
    <header>
      <nav>
        <ul className="supports-backdrop-blur:bg-background/60 fixed left-0 right-0 top-0 z-20 border-b bg-background/95 backdrop-blur w-full flex py-2.5 px-5 justify-between">
          <li>
            <Button asChild variant="ghost">
              <Link href={homePath() as Route}>
                <LucideKanban />
                <h1 className="text-lg font-bold">TicketBounty</h1>
              </Link>
            </Button>
          </li>
          <li>
            <Button asChild variant="default">
              <Link href={ticketsPath() as Route}>Tickets</Link>
            </Button>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
