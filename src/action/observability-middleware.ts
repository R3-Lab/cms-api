import { createMiddleware } from "next-safe-action";

export const loggingMiddleware = createMiddleware<{
  metadata: { name: string };
}>().define(async ({ next, metadata, clientInput }) => {
  const result = await next({ ctx: undefined });

  if (process.env.NODE_ENV === "development") {
    console.debug({ clientInput }, "Input");
    console.debug({ result: result.data }, "Result");
    console.debug({ metadata }, "Metadata");
  }

  return result;
});
