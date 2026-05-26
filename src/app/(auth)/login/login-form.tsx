"use client";

import { useState, useTransition } from "react";
import { OTPInput } from "input-otp";
import { IconLogo } from "@/components/icons";
import { sendOtp, verifyOtp } from "@/server/actions/auth";
import { cn } from "@/lib/utils";

type Step = "email" | "otp";

export function LoginForm() {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSendOtp(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    startTransition(async () => {
      try {
        await sendOtp(email);
        setStep("otp");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      }
    });
  }

  function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    startTransition(async () => {
      try {
        await verifyOtp(email, otp);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Invalid code");
      }
    });
  }

  return (
    <div className="w-full max-w-sm px-6 flex flex-col items-center gap-8">
      {/* logo */}
      <div className="flex flex-col items-center gap-2">
        <IconLogo size={36} className="text-foreground" />
        <span className="text-sm font-medium tracking-widest uppercase text-muted-foreground">
          bagdaddy
        </span>
      </div>

      {step === "email" ? (
        <form onSubmit={handleSendOtp} className="w-full flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-xs text-muted-foreground">
              email address
            </label>
            <input
              id="email"
              type="email"
              required
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className={cn(
                "w-full bg-transparent border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50",
                "focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary",
                "transition-colors"
              )}
            />
            {error && <p className="text-xs text-destructive">{error}</p>}
          </div>
          <button
            type="submit"
            disabled={isPending || !email}
            className={cn(
              "w-full py-3 rounded-lg text-sm font-medium transition-all",
              "bg-primary text-primary-foreground",
              "hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
            )}
          >
            {isPending ? "sending..." : "continue"}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp} className="w-full flex flex-col items-center gap-4">
          <div className="flex flex-col items-center gap-1.5 w-full">
            <p className="text-xs text-muted-foreground">
              check your email — we sent a code to{" "}
              <span className="text-foreground">{email}</span>
            </p>
          </div>

          <OTPInput
            maxLength={6}
            value={otp}
            onChange={setOtp}
            render={({ slots }) => (
              <div className="flex gap-2">
                {slots.map((slot, idx) => (
                  <div
                    key={idx}
                    className={cn(
                      "w-11 h-14 border border-border rounded-lg flex items-center justify-center text-lg font-mono text-foreground relative",
                      "transition-colors",
                      slot.isActive && "border-primary ring-1 ring-primary"
                    )}
                  >
                    {slot.char ?? (
                      slot.hasFakeCaret ? (
                        <div className="w-px h-5 bg-foreground animate-[blink_1s_step-end_infinite]" />
                      ) : null
                    )}
                  </div>
                ))}
              </div>
            )}
          />

          {error && <p className="text-xs text-destructive">{error}</p>}

          <button
            type="submit"
            disabled={isPending || otp.length < 6}
            className={cn(
              "w-full py-3 rounded-lg text-sm font-medium transition-all",
              "bg-primary text-primary-foreground",
              "hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
            )}
          >
            {isPending ? "verifying..." : "verify"}
          </button>

          <button
            type="button"
            onClick={() => { setStep("email"); setOtp(""); setError(""); }}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            ← back
          </button>
        </form>
      )}
    </div>
  );
}
