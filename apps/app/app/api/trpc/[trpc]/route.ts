import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { router } from "@/server/router";
import { createTRPCContext } from "@/server/trpc";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router,
    createContext: async () => await createTRPCContext({ req }),
  });
}

export async function POST(req: NextRequest) {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router,
    createContext: async () => await createTRPCContext({ req }),
  });
}
