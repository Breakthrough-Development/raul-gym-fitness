import Placeholder from "@/components/placeholder";
import { getNotifications } from "../queries/get-notifications";
import { NotificationSearchParams } from "../search-params";
import { NotificationItem } from "./notification-item";
import { NotificationPagination } from "./notification-pagination";
import { NotificationSearchInput } from "./notification-search-input";

export type NotificationListProps = {
  searchParams: NotificationSearchParams;
};

export async function NotificationList({
  searchParams,
}: NotificationListProps) {
  const { notifications, totalPages } = await getNotifications(searchParams);

  return (
    <section className="flex flex-col gap-y-4 animate-fade-from-top">
      <header className="self-center max-w-[580px] w-full flex gap-x-2">
        <h2 className="sr-only">WhatsApp Notifications</h2>
        <NotificationSearchInput placeholder="Buscar notificaciones por mensaje o plantilla" />
      </header>

      <ul className="flex-1 flex gap-x-4 flex-wrap items-center gap-y-4 animate-fade-from-top justify-center">
        {notifications.length ? (
          notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
            />
          ))
        ) : (
          <Placeholder label="No se encontraron notificaciones" />
        )}
      </ul>

      <footer className="w-full max-w-[580px] self-center">
        <NotificationPagination
          currentPage={searchParams.page}
          totalPages={totalPages}
        />
      </footer>
    </section>
  );
}
