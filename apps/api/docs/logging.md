# Logging

Logging right now is done through cloudflare. A simple logger was created so that it outputs a simple json object.

## Logger

The logger is a simple logger that outputs a message and a metadata object.

### Child Loggers

Child loggers are loggers that are created by a parent logger. They inherit the metadata from the parent logger.

Whenever possible, logging under a certain context (like in a service, route, dao, etc...) should be done by first creating a child logger, and then using that logger for all logging within that context.

```ts
// Create a logger for the user service
const userServiceLogger = createLogger({
  context: {
    type: "service", // or "route", "dao", etc...
    name: "users", // the name of the service, route, dao, etc...
  },
});

// Log something within the user service
userServiceLogger.info("User created");
```

## Cloudflare

### Tracing requests

Not as sophisticated as other trace logging options, but using `$cloudflare.$metadata.requestId` can help you know that two or more logs were part of the same request.

```json
{
  "$cloudflare": {
    "$metadata": {
      "requestId": "8f64f583b075bf7c"
    }
  }
}
```
