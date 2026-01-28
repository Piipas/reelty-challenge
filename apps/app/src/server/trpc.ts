import { initTRPC } from "@trpc/server";
import { NextRequest } from "next/server";

export const createTRPCContext = async (opts: { req: NextRequest }) => ({
  req: opts.req,
});

export type Context = Awaited<ReturnType<typeof createTRPCContext>>;

export const t = initTRPC.context<Context>().create();
export const createRouter = t.router;
export const publicProcedure = t.procedure;
