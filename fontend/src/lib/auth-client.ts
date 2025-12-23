import { createAuthClient } from "better-auth/client"
import { env } from "~/env";

export const authClient=createAuthClient({
    baseURL: env.BETTER_AUTH_URL
});