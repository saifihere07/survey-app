import z from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../init";
import { db } from "@/server/db";
import { eq, desc } from "drizzle-orm";
import { surveys, responses, answers } from "@/server/db/schema";
import { TRPCError } from "@trpc/server";

export const surveyRouter = createTRPCRouter({
  // Get all surveys
  getAll: publicProcedure.query(async () => {
    return await db.query.surveys.findMany({
      orderBy: [desc(surveys.createdAt)],
    });
  }),

  // Get single survey with questions
  getById: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ input }) => {
      const survey = await db.query.surveys.findFirst({
        where: eq(surveys.id, input.id),
        with: {
          questions: {
            orderBy: (questions, { asc }) => [asc(questions.order)],
            with: {
              options: {
                orderBy: (options, { asc }) => [asc(options.order)],
              },
            },
          },
        },
      });

      if (!survey) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Survey not found",
        });
      }

      return survey;
    }),

  // Create new survey
  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1).max(255),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const [survey] = await db
        .insert(surveys)
        .values({
          title: input.title,
          description: input.description,
        })
        .returning();

      return survey;
    }),

  // Update survey
  update: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        title: z.string().min(1).max(255).optional(),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const [updated] = await db
        .update(surveys)
        .set({
          title: input.title,
          description: input.description,
          updatedAt: new Date(),
        })
        .where(eq(surveys.id, input.id))
        .returning();

      if (!updated) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Survey not found",
        });
      }

      return updated;
    }),

  // Delete survey
  delete: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ input }) => {
      await db.delete(surveys).where(eq(surveys.id, input.id));
      return { success: true };
    }),

  // Submit survey response
  submit: protectedProcedure
    .input(
      z.object({
        surveyId: z.string().uuid(),
        answers: z.array(
          z.object({
            questionId: z.string().uuid(),
            value: z.string(),
          })
        ),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Create response
      const [response] = await db
        .insert(responses)
        .values({
          userId: ctx.userId,
          surveyId: input.surveyId,
        })
        .returning();

      // Insert all answers
      await db.insert(answers).values(
        input.answers.map((answer) => ({
          responseId: response.id,
          questionId: answer.questionId,
          value: answer.value,
        }))
      );

      return response;
    }),

  // Get user's survey responses
  getMyResponses: protectedProcedure.query(async ({ ctx }) => {
    return await db.query.responses.findMany({
      where: eq(responses.userId, ctx.userId),
      with: {
        survey: true,
        answers: {
          with: {
            question: true,
          },
        },
      },
      orderBy: [desc(responses.createdAt)],
    });
  }),

  // Get single response with details
  getResponseById: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ input, ctx }) => {
      const response = await db.query.responses.findFirst({
        where: eq(responses.id, input.id),
        with: {
          survey: true,
          user: {
            columns: {
              id: true,
              name: true,
              email: true,
            },
          },
          answers: {
            with: {
              question: {
                with: {
                  options: true,
                },
              },
            },
          },
        },
      });

      if (!response) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Response not found",
        });
      }

      // Check if user owns this response
      if (response.userId !== ctx.userId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You don't have access to this response",
        });
      }

      return response;
    }),

  // Get all responses for a survey (for analytics)
  getSurveyResponses: protectedProcedure
    .input(z.object({ surveyId: z.string().uuid() }))
    .query(async ({ input }) => {
      return await db.query.responses.findMany({
        where: eq(responses.surveyId, input.surveyId),
        with: {
          user: {
            columns: {
              id: true,
              name: true,
              email: true,
            },
          },
          answers: {
            with: {
              question: {
                with: {
                  options: true,
                },
              },
            },
          },
        },
        orderBy: [desc(responses.createdAt)],
      });
    }),
});
