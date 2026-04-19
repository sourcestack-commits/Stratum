import type { CommandMap } from "@repo/types";

type CommandHandler<K extends keyof CommandMap> = CommandMap[K] extends void
  ? () => void | Promise<void>
  : (payload: CommandMap[K]) => void | Promise<void>;

type AnyCommandHandler = (payload?: unknown) => void | Promise<void>;

const handlers = new Map<string, AnyCommandHandler>();

export function registerCommand<K extends keyof CommandMap>(
  command: K,
  handler: CommandHandler<K>,
): void {
  handlers.set(command, handler as AnyCommandHandler);
}

export function executeCommand<K extends keyof CommandMap>(
  ...args: CommandMap[K] extends void ? [K] : [K, CommandMap[K]]
): void {
  const [command, payload] = args;
  const handler = handlers.get(command);
  if (!handler) {
    if (import.meta.env.DEV) {
      console.warn(`[CORE] No handler registered for command: ${command}`);
    }
    return;
  }
  handler(payload);
}
