import { createCallerFactory, createTRPCContext } from "@/server/trpc";
import { appRouter } from "@/server/routers";

const createCaller = createCallerFactory(appRouter);

export const api = createCaller(createTRPCContext);
