"use server";

import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { redirect } from "next/navigation";

export async function sendOtp(email: string) {
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { shouldCreateUser: true },
  });
  if (error) throw new Error(error.message);
}

export async function verifyOtp(email: string, token: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: "email",
  });

  if (error || !data.user) throw new Error(error?.message ?? "Invalid code");

  await db
    .insert(users)
    .values({ id: data.user.id, email })
    .onConflictDoUpdate({
      target: users.id,
      set: { email },
    });

  redirect("/dashboard");
}
