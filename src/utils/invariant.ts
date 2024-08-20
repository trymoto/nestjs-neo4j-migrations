export function invariant<T>(
  condition: T | null | undefined,
  message: string,
): asserts condition is T {
  if (!condition) {
    throw new Error(message);
  }
}
