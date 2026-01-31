"use client";

import type { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { ContainerProvider } from "@/config/di/provider";
import { useAuthStore } from "@/modules/authentication/presentation/store/auth.store";
import { TokenService } from "@/modules/authentication/infrastructure/services/token.service";

interface ProvidersProps {
  children: ReactNode;
}

function AuthHydration({ children }: { children: ReactNode }) {
  const hydrate = useAuthStore((state) => state.hydrate);
  const isHydrated = useAuthStore((state) => state.isHydrated);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  // Sync token to cookie for proxy/middleware access
  useEffect(() => {
    const syncTokenToCookie = () => {
      const token = TokenService.getAccessToken();
      if (token) {
        document.cookie = `nevada_auth_token=${token}; path=/; SameSite=Lax`;
      } else {
        document.cookie =
          "nevada_auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      }
    };

    syncTokenToCookie();

    // Listen for storage changes (in case another tab logs in/out)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "nevada_auth_token") {
        syncTokenToCookie();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [isHydrated]);

  return <>{children}</>;
}

export function Providers({ children }: ProvidersProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ContainerProvider>
        <AuthHydration>{children}</AuthHydration>
      </ContainerProvider>
    </QueryClientProvider>
  );
}
