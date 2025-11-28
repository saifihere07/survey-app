import z from "zod";
import { createTRPCRouter, protectedProcedure } from "../init";
import { db } from "@/server/db";
import { eq } from "drizzle-orm";
import { questions, questionOptions } from "@/server/db/schema";
import { TRPCError } from "@trpc/server";

export const questionRouter = createTRPCRouter({
  // Create question
  create: protectedProcedure
    .input(
      z.object({
        surveyId: z.string().uuid(),
        title: z.string().min(1),
        description: z.string().optional(),
        required: z.boolean().default(false),
        type: z.enum(["select", "textarea", "text"]),
        order: z.number().int(),
        options: z
          .array(
            z.object({
              label: z.string(),
              value: z.string(),
              order: z.number().int().default(0),
            })
          )
          .optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { options, ...questionData } = input;

      // Create question
      const [question] = await db
        .insert(questions)
        .values(questionData)
        .returning();

      // Create options if provided
      if (options && options.length > 0) {
        await db.insert(questionOptions).values(
          options.map((opt) => ({
            questionId: question.id,
            label: opt.label,
            value: opt.value,
            order: opt.order,
          }))
        );
      }

      return question;
    }),

  // Update question
  update: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        title: z.string().min(1).optional(),
        description: z.string().optional(),
        required: z.boolean().optional(),
        type: z.enum(["select", "textarea", "text"]).optional(),
        order: z.number().int().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...updateData } = input;

      const [updated] = await db
        .update(questions)
        .set({
          ...updateData,
          updatedAt: new Date(),
        })
        .where(eq(questions.id, id))
        .returning();

      if (!updated) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Question not found",
        });
      }

      return updated;
    }),

  // Delete question
  delete: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ input }) => {
      await db.delete(questions).where(eq(questions.id, input.id));
      return { success: true };
    }),

  // Add option to question
  addOption: protectedProcedure
    .input(
      z.object({
        questionId: z.string().uuid(),
        label: z.string(),
        value: z.string(),
        order: z.number().int().default(0),
      })
    )
    .mutation(async ({ input }) => {
      const [option] = await db
        .insert(questionOptions)
        .values(input)
        .returning();

      return option;
    }),

  // Update option
  updateOption: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        label: z.string().optional(),
        value: z.string().optional(),
        order: z.number().int().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...updateData } = input;

      const [updated] = await db
        .update(questionOptions)
        .set({
          ...updateData,
          updatedAt: new Date(),
        })
        .where(eq(questionOptions.id, id))
        .returning();

      if (!updated) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Option not found",
        });
      }

      return updated;
    }),

  // Delete option
  deleteOption: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ input }) => {
      await db.delete(questionOptions).where(eq(questionOptions.id, input.id));
      return { success: true };
    }),
});
