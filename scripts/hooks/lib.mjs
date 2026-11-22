// Shared helpers for the Claude Code hook scripts.
import { readFileSync } from 'node:fs';

/** Reads the hook input (JSON) from stdin. Returns null when it is not valid JSON. */
export function readInput() {
  try {
    return JSON.parse(readFileSync(0, 'utf8'));
  } catch {
    return null;
  }
}

/** Blocks the tool call: the message goes back to Claude, and exit code 2 stops the call. */
export function block(message) {
  console.error(message);
  process.exit(2);
}
