import { useState, type FormEvent } from "react";
import { Button, Input, Stack, H2, Text, Label } from "@repo/design-system";
import { resolveHttpError } from "@repo/error-handling";
import { useLogin } from "../hooks/use-login";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const login = useLogin();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    login.mutate({ email, password });
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm">
      <Stack gap="lg">
        <Stack gap="xs">
          <H2>Sign In</H2>
          <Text variant="muted" size="sm">
            Enter your credentials to continue
          </Text>
        </Stack>
        <Stack gap="sm">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Stack>
        <Stack gap="sm">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Stack>
        {login.error && (
          <Text variant="error" size="sm">
            {resolveHttpError(login.error).message}
          </Text>
        )}
        <Button type="submit" disabled={login.isPending}>
          {login.isPending ? "Signing in..." : "Sign In"}
        </Button>
      </Stack>
    </form>
  );
}
