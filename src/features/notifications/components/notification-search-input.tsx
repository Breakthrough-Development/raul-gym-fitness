"use client";

import { SearchInput } from "@/components/search-input";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

type NotificationSearchInputProps = {
  placeholder?: string;
};

export const NotificationSearchInput = ({
  placeholder = "Buscar notificaciones por mensaje o plantilla",
}: NotificationSearchInputProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSearch = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams);
      if (value) {
        params.set("search", value);
      } else {
        params.delete("search");
      }
      params.delete("page"); // Reset to first page
      router.push(`?${params.toString()}`);
    },
    [router, searchParams]
  );

  return (
    <SearchInput
      placeholder={placeholder}
      value={searchParams.get("search") ?? ""}
      onChange={handleSearch}
    />
  );
};
