"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { signIn } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? "Signing in…" : "Sign in"}
    </Button>
  );
}

export default function LoginPage() {
  const [error, formAction] = useActionState<string | null, FormData>(signIn, null);

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-edge-margin-mobile lg:px-edge-margin-desktop py-section-gap">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="font-display uppercase tracking-tight">
            Admin
          </CardTitle>
          <CardDescription>Sign in to manage the site.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" autoComplete="username" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <SubmitButton />
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
