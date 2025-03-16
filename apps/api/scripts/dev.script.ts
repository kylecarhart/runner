import concurrently from "concurrently";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { result } = concurrently(
  [
    { command: "wrangler dev", name: "wrangler", prefixColor: "green" },
    {
      // Generate types for RPC.
      command: "pnpm run emit-types --watch --preserveWatchOutput",
      name: "types",
      prefixColor: "cyan",
    },
  ],
  {
    prefix: "name",
  },
);
