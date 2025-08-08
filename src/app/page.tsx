import { ticketsPath } from "@/paths";
import Link from "next/link";

export default function HomePage() {
  return (
    <div>
      <h1>Hello World!!!</h1>
      <Link href={ticketsPath()}>Tickets</Link>
    </div>
  );
}
