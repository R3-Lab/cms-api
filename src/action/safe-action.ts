import { createSafeActionClient, DEFAULT_SERVER_ERROR_MESSAGE } from "next-safe-action";
import { VALIDATION_ERROR_MESSAGE } from "./safe-action-helpers";
import { z, ZodError } from "zod";
import { Duration } from "@upstash/ratelimit";
import { loggingMiddleware } from "./observability-middleware";
import { rateLimitingMiddleware } from "./ratelimit.middleware";

// To match the redis rate limiter schema.
const durationSchema = z
    .string()
    .regex(/^\d+\s*[mshd]{1,2}$/, "Invalid duration format")
    .refine((val): val is Duration => {
        const [num, unit] = val.split(/\s+/).filter(Boolean);
        return (
            !isNaN(Number(num)) && ["ms", "s", "m", "h", "d"].includes(unit as string)
        );
    }, "Duration must be a number followed by a valid unit (ms, s, m, h, d)");

export const simpleActionClient = createSafeActionClient();

// Base client which has server error handling, and metadata
export const actionClientWithMeta = createSafeActionClient({
    handleServerError(e) {
        if (e instanceof ZodError) {
            console.error(e.message);
            return VALIDATION_ERROR_MESSAGE;
        } else if (e instanceof Error) {
            return e.message;
        }

        return DEFAULT_SERVER_ERROR_MESSAGE;
    },
    defineMetadataSchema() {
        return z.object({
            name: z.string(),
            limiter: z
                .object({
                    tokens: z.number(),
                    window: durationSchema,
                })
                .optional(),
        });
    },
});

export const actionClient = actionClientWithMeta
    // Logging
    .use(loggingMiddleware);

export const rateLimitedActionClient = actionClientWithMeta
    // Logging
    .use(loggingMiddleware)
    // Rate limiting
    .use(rateLimitingMiddleware);


