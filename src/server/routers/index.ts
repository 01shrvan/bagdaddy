import { router } from "@/server/trpc";
import { clientsRouter } from "./clients";
import { projectsRouter } from "./projects";
import { timeRouter } from "./time";
import { invoicesRouter } from "./invoices";
import { usersRouter } from "./users";

export const appRouter = router({
  clients: clientsRouter,
  projects: projectsRouter,
  time: timeRouter,
  invoices: invoicesRouter,
  users: usersRouter,
});

export type AppRouter = typeof appRouter;
