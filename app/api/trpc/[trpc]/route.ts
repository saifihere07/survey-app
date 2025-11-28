import { createTRPCContext } from "@/trpc/init";
import { appRouter } from "@/trpc/routers";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

const handler = (req: Request) => {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: createTRPCContext,
    onError:
      process.env.NODE_ENV === "development"
        ? ({ path, error }) => {
            console.error(`tRPC Error on  ${path}: ${error.message}`);
          }
        : undefined,
  });
};

export { handler as GET, handler as POST };
