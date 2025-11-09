"use client";
import type { User } from "@prisma/client";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { getAuth } from "../queries/get-auth";

type AuthUser = User | null;

const useAuth = () => {
  const [user, setUser] = useState<AuthUser>(null);
  const [isFetched, setIsFetched] = useState(false);

  const pathname = usePathname();

  useEffect(() => {
    const fetchUser = async () => {
      const { user } = await getAuth();
      setUser(user);
      setIsFetched(true);
    };
    fetchUser();
  }, [pathname]);

  return { user, isFetched };
};

export { useAuth };
