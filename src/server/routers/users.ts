import { TRPCError } from "@trpc/server";
import { router, protectedProcedure } from "@/server/trpc";
import { createAdminClient } from "@/lib/supabase/admin";

export const usersRouter = router({
  deleteAccount: protectedProcedure.mutation(async ({ ctx }) => {
    const admin = createAdminClient();
    const { error } = await admin.auth.admin.deleteUser(ctx.user.id);
    if (error) {
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: error.message });
    }
    return { success: true };
  }),
});
