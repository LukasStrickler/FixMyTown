import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  userProcedure,
} from "@/server/api/trpc";

export const postRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),


  getSecretMessage: userProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
