import z from "zod";
import { createTRPCRouter, publicProcedure } from "../init";
import { db } from "@/server/db";
import { eq } from "drizzle-orm";
import { users } from "@/server/db/schema";
import { TRPCError } from "@trpc/server";
import { hash } from "bcrypt-ts-edge";

export const authRouter = createTRPCRouter({
  signUp: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(6),
        name: z.string().min(2).max(100),
      })
    )
    .mutation(async ({ input }) => {
      // Check if user already exists
      const existingUser = await db.query.users.findFirst({
        where: eq(users.email, input.email),
      });

      if (existingUser) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "User with this email already exists",
        });
      }

      // Hash password
      const hashedPassword = await hash(input.password, 10);

      // Create user
      await db
        .insert(users)
        .values({
          email: input.email,
          password: hashedPassword,
          name: input.name,
        })
        .returning({
          id: users.id,
          email: users.email,
          name: users.name,
        });

      // Return the created user
      return {
        success: true,
        message: "Account created successfully",
      };
    }),
});
