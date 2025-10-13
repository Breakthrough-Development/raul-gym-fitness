"use client";
// https://tanstack.com/query/latest/docs/framework/react/guides/advanced-ssr
import {
  isServer,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

const CONFIGURATION = {
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
    },
  },
};

const makeQueryClient = () => {
  return new QueryClient(CONFIGURATION);
};

let browserQueryClient: QueryClient | undefined = undefined;

const getQueryClient = () => {
  if (isServer) {
    return makeQueryClient();
  }
  if (!browserQueryClient) {
    browserQueryClient = makeQueryClient();
  }
  return browserQueryClient;
};

type ReactQueryProviderProps = {
  children: React.ReactNode;
};

export const ReactQueryProvider = ({ children }: ReactQueryProviderProps) => {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
