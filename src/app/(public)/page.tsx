import Heading from "@/components/heading";
import { Spinner } from "@/components/spiner";
import { TotalRevenue } from "@/features/dashboard/components/totalRevenue";
import { TotalSubscriptions } from "@/features/dashboard/components/totalSubscriptions";
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
        <TotalRevenue />
        <TotalSubscriptions title="Daily Subscriptions" type="DAILY" />
        <TotalSubscriptions title="Monthly Subscriptions" type="MONTHLY" />
      </Suspense>
    </div>
  );
}
