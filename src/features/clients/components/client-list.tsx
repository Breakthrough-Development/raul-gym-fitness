import Placeholder from "@/components/placeholder";
import { ClientParsedSearchParams } from "@/features/clients/client-search-params";
import { ClientPagination } from "@/features/clients/components/client-pagination";
import { ClientSearchInput } from "@/features/clients/components/client-search-input";
import { getClients } from "../queries/get-clients";
import { ClientItem } from "./client-item";

type ClientListProps = {
  searchParams: ClientParsedSearchParams;
};

export async function ClientList({ searchParams }: ClientListProps) {
  const { list: clients, metadata } = await getClients(searchParams);
  return (
    <section className="flex flex-col gap-y-4 animate-fade-from-top">
      <header className="self-center max-w-[420px] w-full flex gap-x-2">
        <h2 className="sr-only">Clientes</h2>
        <ClientSearchInput placeholder="Buscar clientes por nombre" />
        {/* <ClientSortSelect options={SORT_OPTIONS} /> */}
      </header>
      <ul className="flex-1 flex gap-x-4 flex-wrap items-center gap-y-4 animate-fade-from-top justify-center">
        {clients.length ? (
          clients.map((client) => (
            <ClientItem key={client.id} client={client} />
          ))
        ) : (
          <Placeholder label="No se encontraron clientes" />
        )}
      </ul>
      <footer className="w-full max-w-[420px] self-center">
        <ClientPagination paginatedMetaData={metadata} />
      </footer>
    </section>
  );
}
