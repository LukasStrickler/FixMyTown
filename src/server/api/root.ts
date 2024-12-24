import { postRouter } from "@/server/api/routers/post";
import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import { reportRouter } from "./routers/report";
import { userRouter } from "./routers/userRouter";
import { reportDetailsRouter } from "./routers/reportDetails";
import { statusRouter } from "./routers/status";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  report: reportRouter,
  user: userRouter,
  reportDetails: reportDetailsRouter,
  status: statusRouter,
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

