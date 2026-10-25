import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod/v4";
import { router, protectedProcedure } from "@/server/trpc";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { createAdminClient } from "@/lib/supabase/admin";

export const usersRouter = router({
  updateProfile: protectedProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      await db
        .insert(users)
        .values({ id: ctx.user.id, email: ctx.user.email ?? "", name: input.name })
        .onConflictDoUpdate({ target: users.id, set: { name: input.name } });

      return { success: true };
    }),

  deleteAccount: protectedProcedure.mutation(async ({ ctx }) => {
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      throw new TRPCError({ code: "PRECONDITION_FAILED", message: "Account deletion is not configured on this server" });
    }

    const admin = createAdminClient();
    const { error } = await admin.auth.admin.deleteUser(ctx.user.id);
    if (error) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: error.message });

    await db.delete(users).where(eq(users.id, ctx.user.id));

    return { success: true };
  }),
});
