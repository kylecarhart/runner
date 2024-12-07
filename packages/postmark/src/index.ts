import { client } from "./client";

// When importing this library, baseUrl will be set automatically :)
client.setConfig({
  baseUrl: "https://api.postmarkapp.com",
});

export * as Postmark from "./client";
