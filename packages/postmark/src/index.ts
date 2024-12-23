import * as client from "./client";

// When importing this library, baseUrl will be set automatically :)
client.client.setConfig({
  baseUrl: "https://api.postmarkapp.com",
});

/**
 * For testing purposes, Postmark lets you send test emails that won’t actually
 * get delivered to the recipient. Used to verify that your data is valid.
 * @see https://postmarkapp.com/developer/user-guide/send-email-with-api
 */
const TEST_HEADER_TOKEN = "POSTMARK_API_TEST";

export const Postmark = {
  ...client,
  TEST_HEADER_TOKEN,
};
