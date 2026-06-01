export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { LoginForm } from "./login-form";
import { LoginCover } from "./login-cover";
import { IconLogo } from "@/components/icons";

export default async function LoginPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user) redirect("/dashboard");

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden overflow-hidden border-r border-border lg:block">
        <LoginCover />
        <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-background/20" />
        <div className="absolute inset-0 flex flex-col justify-between p-10">
          <div className="flex items-center gap-2.5">
            <IconLogo size={22} className="text-foreground" />
            <span className="font-heading text-lg font-bold tracking-tight text-foreground">bagdaddy</span>
          </div>
          <div>
            <h2 className="font-heading text-4xl font-extrabold leading-[0.95] tracking-tight text-foreground">
              Get paid for
              <br />
              every hour
              <br />
              you work.
            </h2>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-foreground/70">
              Track time, generate invoices, and share a pay link. The quiet,
              fast finance tool built for freelancers.
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center px-6 py-16">
        <LoginForm />
      </div>
    </div>
  );
}
