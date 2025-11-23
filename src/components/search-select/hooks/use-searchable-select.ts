import { useEffect, useMemo, useRef, useState } from "react";
import { filterOptions, getLabelText } from "../helpers";
import type { SearchableSelectOption } from "../types";

type UseSearchableSelectProps = {
  options: SearchableSelectOption[];
};

export const useSearchableSelect = ({ options }: UseSearchableSelectProps) => {
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredOptions = useMemo(
    () => filterOptions(options, search),
    [options, search]
  );

  useEffect(() => {
    if (!isOpen || !inputRef.current) return;
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  }, [isOpen]);

  const handleClose = () => {
    setIsOpen(false);
    setSearch("");
  };

  const labelText = getLabelText(
    search,
    filteredOptions.length,
    options.length
  );

  return {
    search,
    setSearch,
    isOpen,
    setIsOpen,
    filteredOptions,
    handleClose,
    labelText,
    inputRef,
  };
};

