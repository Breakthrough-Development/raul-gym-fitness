import Heading from "@/components/heading";
import { Spinner } from "@/components/spiner";
import TicketList from "@/features/ticket/components/ticket-list";
import { SearchParamsCache } from "@/features/ticket/search-params";
import { SearchParams } from "nuqs/server";
import { Suspense } from "react";

type HomePageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function HomePage({ searchParams }: HomePageProps) {
  return (
    <div className="flex-1 flex flex-col gap-y-8">
      <Heading title="Home" description="Your home place to start" />

      <Suspense fallback={<Spinner />}>
        <TicketList
          searchParams={SearchParamsCache.parse(await searchParams)}
        />
      </Suspense>
    </div>
  );
}
