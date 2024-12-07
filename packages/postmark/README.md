# Postmark Fetch Client

This package is a fetch client for the Postmark API. It is generated from the Postmark API swagger file using the `@hey-api/openapi-ts` package. This is necessary because the official Postmark API client supports only Node.js, with no consideration for edge environments.

TODO: Currently, hey-api openapi-ts has a bug that does not properly generate the client types. To get around this, the Postmark `server.yml` file has been converted from Swagger 2.0 to OpenAPI 3.1. Ideally in the future when this bug is fixed, the `server.yml` file can be deleted from this package and we can point to the external, official swagger file.

## Usage

```ts
import { Postmark } from "@runner/postmark";

Postmark.sendEmail({
  headers: {
    "X-Postmark-Server-Token": "<POSTMARK_SERVER_TOKEN>",
  },
  body: {
    From: "noreply@carhart.dev",
    To: "email@example.com",
    Subject: "Confirm Your Email",
    TextBody: `This is a test`,
  },
});
```

## Notes

- The `X-Postmark-Server-Token` header is required for all requests.
- The baseUrl is set automatically when this library is imported.
- The `From` field is required and must be a valid email address in Postmark.
