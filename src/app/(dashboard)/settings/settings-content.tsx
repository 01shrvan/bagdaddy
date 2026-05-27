"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Container } from "@/components/container";
import { DeleteAccountSheet } from "@/components/sheets/settings/delete-account.sheet";
import { createClient } from "@/lib/supabase/client";
import { useTRPC } from "@/lib/trpc/client";

type UserInfo = { name: string; email: string };

export function SettingsContent() {
  const router = useRouter();
  const trpc = useTRPC();

  const [user, setUser] = useState<UserInfo | null>(null);
  const [name, setName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [confirmEmail, setConfirmEmail] = useState("");

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        const email = data.user.email ?? "";
        const n =
          data.user.user_metadata?.full_name ??
          data.user.user_metadata?.name ??
          email.split("@")[0] ??
          "";
        setUser({ name: n, email });
        setName(n);
      }
    });
  }, []);

  const deleteAccount = useMutation(
    trpc.users.deleteAccount.mutationOptions({
      onSuccess: async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        router.push("/login");
      },
    }),
  );

  async function handleSave() {
    if (!name.trim() || name.trim() === user?.name) return;
    setIsSaving(true);
    const supabase = createClient();
    await supabase.auth.updateUser({ data: { full_name: name.trim() } });
    setUser((prev) => (prev ? { ...prev, name: name.trim() } : prev));
    setIsSaving(false);
  }

  if (!user) {
    return (
      <Container>
        <div className="space-y-8">
          <div className="space-y-2">
            <Skeleton className="h-9 w-40" />
            <Skeleton className="h-4 w-72" />
          </div>
          <Skeleton className="h-52 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <main className="space-y-8">
        <div className="space-y-1">
          <h1 className="font-semibold text-3xl tracking-tight">Settings</h1>
          <p className="text-muted-foreground text-sm">
            Manage your account details and preferences.
          </p>
        </div>

        <div className="border">
          <div className="px-6 py-5 border-b">
            <h2 className="text-base font-semibold">Profile</h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              Update your display name shown across the app.
            </p>
          </div>
          <div className="px-6 py-5 space-y-4">
            <div className="space-y-1.5 max-w-sm">
              <Label htmlFor="settings-name">Display name</Label>
              <Input
                id="settings-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                disabled={isSaving}
              />
            </div>
            <div className="space-y-1.5 max-w-sm">
              <Label htmlFor="settings-email">Email</Label>
              <Input
                id="settings-email"
                value={user.email}
                disabled
                className="text-muted-foreground"
              />
              <p className="text-xs text-muted-foreground">
                Email cannot be changed here.
              </p>
            </div>
          </div>
          <div className="px-6 py-4 border-t flex justify-end">
            <Button
              size="sm"
              disabled={isSaving || !name.trim() || name.trim() === user.name}
              onClick={handleSave}
            >
              {isSaving ? "Saving..." : "Save changes"}
            </Button>
          </div>
        </div>

        <div className="border border-destructive/25">
          <div className="px-6 py-5 border-b border-destructive/25">
            <h2 className="text-base font-semibold text-destructive">Danger zone</h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              Permanently delete your account and all associated data — clients,
              projects, time entries, and invoices. This action cannot be undone.
            </p>
          </div>
          <div className="px-6 py-4 flex justify-end">
            <Button variant="destructive" size="sm" onClick={() => setDeleteOpen(true)}>
              Delete account permanently
            </Button>
          </div>
        </div>
      </main>

      <DeleteAccountSheet
        open={deleteOpen}
        setOpen={setDeleteOpen}
        userEmail={user.email}
        confirmEmail={confirmEmail}
        setConfirmEmail={setConfirmEmail}
        canDelete={confirmEmail === user.email}
        isDeleting={deleteAccount.isPending}
        onDelete={() => deleteAccount.mutate()}
      />
    </Container>
  );
}
