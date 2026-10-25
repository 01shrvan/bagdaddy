"use client";

import { useState } from "react";
import { MutationCache, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createTRPCClient, httpBatchLink } from "@trpc/client";
import { TRPCProvider } from "@/lib/trpc/client";
import { TooltipProvider } from "@/components/ui/tooltip";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Toaster, toast } from "sonner";
import SuperJSON from "superjson";
import type { AppRouter } from "@/server/routers";

function errorMessage(error: unknown) {
  const message = error instanceof Error ? error.message : "Something went wrong";
  try {
    const issues = JSON.parse(message);
    if (Array.isArray(issues) && issues[0]?.message) return issues[0].message as string;
  } catch {}
  return message;
}

function getBaseUrl() {
  if (typeof window !== "undefined") return "";
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return `http://localhost:${process.env.PORT ?? 3000}`;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        mutationCache: new MutationCache({
          onError: (error, _vars, _ctx, mutation) => {
            if (!mutation.options.onError) toast.error(errorMessage(error));
          },
        }),
      }),
  );
  const [trpcClient] = useState(() =>
    createTRPCClient<AppRouter>({
      links: [
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`,
          transformer: SuperJSON,
        }),
      ],
    })
  );

  return (
    <NuqsAdapter>
      <TRPCProvider queryClient={queryClient} trpcClient={trpcClient}>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            {children}
            <Toaster position="bottom-right" />
          </TooltipProvider>
        </QueryClientProvider>
      </TRPCProvider>
    </NuqsAdapter>
  );
}
