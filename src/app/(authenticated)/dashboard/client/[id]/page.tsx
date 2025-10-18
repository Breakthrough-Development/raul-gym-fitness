import Heading from "@/components/heading";
import Placeholder from "@/components/placeholder";
import { ClientItem } from "@/features/clients/components/client-item";
import { getClient } from "@/features/clients/queries/get-client";

type ClientDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ClientDetailPage({
  params,
}: ClientDetailPageProps) {
  const { id } = await params;
  const client = await getClient(id);

  if (!client) {
    return <Placeholder label="Client not found" />;
  }

  return (
    <section className="flex-1 flex flex-col gap-y-8 max-w-7xl mx-auto">
      <Heading
        title="Client"
        description="Client details and payment history"
      />
      <ClientItem client={client} isDetail />
    </section>
  );
}
