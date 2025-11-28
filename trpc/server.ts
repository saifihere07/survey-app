import "server-only";
import { createCallerfactory, createTRPCContext } from "./init";
import { cache } from "react";
import { appRouter } from "./routers";
//TODO:
const createCaller = createCallerfactory(appRouter);
export const trpc = cache(async () => {
  const context = await createTRPCContext();
  return createCaller(context);
});
