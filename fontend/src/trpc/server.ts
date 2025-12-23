import { cache } from "react";

import { createCaller, type AppRouter } from "~/server/api/root";
import { createTRPCContext } from "~/server/api/trpc";

export const api = {
  /**
   * Server-side helper for calling tRPC procedures in Server Components.
   *
   * @example
   * const posts = await api.post.all();
   */
  caller: cache(async () => {
    const headers = new Headers();
    return createCaller(
      await createTRPCContext({
        headers,
      }),
    );
  }),
};

export type { AppRouter };

export function HydrateClient(props: { children: React.ReactNode }) {
  // In this simple setup we don't need special hydration logic;
  // this component exists just to match the template API.
  return <>{props.children}</>;
}


