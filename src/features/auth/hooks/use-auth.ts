"use client";
import { useEffect, useState } from "react";
import { getAuth } from "../queries/get-auth";
import { User } from "@prisma/client";
import { usePathname } from "next/navigation";

const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
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
