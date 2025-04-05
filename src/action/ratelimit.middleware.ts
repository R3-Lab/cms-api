import { Ratelimit } from "@upstash/ratelimit";
import { Duration } from "@upstash/ratelimit";
import { createMiddleware } from "next-safe-action";
import { headers } from "next/headers";
import { Redis } from "@upstash/redis";

const redisClient = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
});


export const rateLimitingMiddleware = createMiddleware<{
    metadata: { name: string; limiter?: { tokens: number; window: Duration } };
}>().define(async ({ next, metadata }) => {
    const {
        limiter = {
            // Default to 1 requests per 14 hours
            tokens: 1,
            window: "14h",
        },
        name,
    } = metadata;

    const channel = "action";

    const ratelimit = new Ratelimit({
        limiter: Ratelimit.fixedWindow(limiter.tokens, limiter.window),
        redis: redisClient,
    });

    // IP header used when deploying to Vercel
    const ip = (await headers()).get("x-forwarded-for");

    const { success, remaining } = await ratelimit.limit(
        `${ip}-${channel}-${name}`,
    );

    if (!success) {
        throw new Error("Seems like you've already send this form. Please try again later.");
    }

    return next({
        ctx: {
            ratelimit: {
                remaining,
            },
        },
    });
});