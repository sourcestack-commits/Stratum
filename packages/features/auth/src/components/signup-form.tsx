import { useState, type FormEvent } from "react";
import { Button, Input, Stack, H2, Text, Label } from "@repo/design-system";
import { resolveHttpError } from "@repo/error-handling";
import { useSignup } from "../hooks/use-signup";

export function SignupForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const signup = useSignup();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    signup.mutate({ email, password, name });
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm">
      <Stack gap="lg">
        <Stack gap="xs">
          <H2>Create Account</H2>
          <Text variant="muted" size="sm">
            Enter your details to get started
          </Text>
        </Stack>
        <Stack gap="sm">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </Stack>
        <Stack gap="sm">
          <Label htmlFor="signup-email">Email</Label>
          <Input
            id="signup-email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Stack>
        <Stack gap="sm">
          <Label htmlFor="signup-password">Password</Label>
          <Input
            id="signup-password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Stack>
        {signup.error && (
          <Text variant="error" size="sm">
            {resolveHttpError(signup.error).message}
          </Text>
        )}
        <Button type="submit" disabled={signup.isPending}>
          {signup.isPending ? "Creating account..." : "Create Account"}
        </Button>
      </Stack>
    </form>
  );
}
