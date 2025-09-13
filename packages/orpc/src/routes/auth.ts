import { publicProcedure } from "~/lib/procedures";

export const authRouter = {
  getSession: publicProcedure
    .route({
      method: "GET",
      path: "/user/session",
    })
    .handler(({ context }) => {
      return context.session ?? null;
    }),
};
