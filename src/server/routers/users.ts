import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { router, protectedProcedure } from "@/server/trpc";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { createAdminClient } from "@/lib/supabase/admin";

export const usersRouter = router({
  deleteAccount: protectedProcedure.mutation(async ({ ctx }) => {
    await db.delete(users).where(eq(users.id, ctx.user.id));

    const admin = createAdminClient();
    const { error } = await admin.auth.admin.deleteUser(ctx.user.id);
    if (error) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: error.message });

    return { success: true };
  }),
});
