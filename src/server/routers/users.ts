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
      const [updated] = await db
        .update(users)
        .set({ displayName: input.name })
        .where(eq(users.id, ctx.user.id))
        .returning();

      const admin = createAdminClient();
      await admin.auth.admin.updateUserById(ctx.user.id, { user_metadata: { full_name: input.name } });

      return updated;
    }),

  deleteAccount: protectedProcedure.mutation(async ({ ctx }) => {
    await db.delete(users).where(eq(users.id, ctx.user.id));

    const admin = createAdminClient();
    const { error } = await admin.auth.admin.deleteUser(ctx.user.id);
    if (error) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: error.message });

    return { success: true };
  }),
});
