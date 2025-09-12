"use client";

import { consumeCookiedByKey } from "@/actions/cookies";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

const RedirectToast = () => {
  const pathname = usePathname();
  useEffect(() => {
    const showCookieToast = async () => {
      const message = await consumeCookiedByKey("toast");

      if (message) {
        toast.success(message);
      }
    };
    showCookieToast();
  }, [pathname]);

  return null;
};

export { RedirectToast };
