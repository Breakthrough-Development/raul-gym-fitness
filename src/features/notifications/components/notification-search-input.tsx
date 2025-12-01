"use client";

import { SearchInput } from "@/components/search-input";
import { useQueryState } from "nuqs";
import {
  notificationSearchKey,
  notificationSearchParser,
} from "../search-params";

type NotificationSearchInputProps = {
  placeholder?: string;
};

export const NotificationSearchInput = ({
  placeholder = "Buscar notificaciones por mensaje o plantilla",
}: NotificationSearchInputProps) => {
  const [search, setSearch] = useQueryState(
    notificationSearchKey,
    notificationSearchParser
  );

  return (
    <SearchInput
      placeholder={placeholder}
      value={search}
      onChange={setSearch}
    />
  );
};
