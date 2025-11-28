import { createTRPCRouter } from "../init";
import { authRouter } from "./auth.routers";
import { questionRouter } from "./question.router";
import { surveyRouter } from "./survey.router";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  survey: surveyRouter,
  question: questionRouter,
});

export type AppRouter = typeof appRouter;
