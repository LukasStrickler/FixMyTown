import { createTRPCRouter, createCallerFactory } from "@/server/api/trpc";

import { usersManagementRouter } from "@/server/api/routers/users/management";
import { usersProfileRouter } from "@/server/api/routers/users/profile";
import { usersListRouter } from "@/server/api/routers/users/list";
import { reportsCreateRouter } from "@/server/api/routers/reports/create";
import { reportsListRouter } from "@/server/api/routers/reports/list";
import { reportsDetailsRouter } from "@/server/api/routers/reports/details";
import { reportsUpdateRouter } from "@/server/api/routers/reports/update";
export const appRouter = createTRPCRouter({
  users: createTRPCRouter({
    management: usersManagementRouter,
    profile: usersProfileRouter,
    list: usersListRouter,
  }),
  reports: createTRPCRouter({
    create: reportsCreateRouter,
    list: reportsListRouter,
    details: reportsDetailsRouter,
    update: reportsUpdateRouter,
  }),
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);

