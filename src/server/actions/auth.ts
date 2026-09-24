"use server";

import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { redirect } from "next/navigation";

export type SendOtpResult = { ok: true } | { ok: false; error: string };

export async function sendOtp(email: string): Promise<SendOtpResult> {
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { shouldCreateUser: true },
  });
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export type VerifyOtpResult = { ok: true } | { ok: false; error: string };

export async function verifyOtp(
  email: string,
  token: string
): Promise<VerifyOtpResult> {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: "email",
  });

  if (error || !data.user)
    return { ok: false, error: error?.message ?? "Invalid code" };

  await db
    .insert(users)
    .values({ id: data.user.id, email })
    .onConflictDoUpdate({
      target: users.id,
      set: { email },
    });

  redirect("/dashboard");
}
