import closeWithGrace from "close-with-grace";
import fastify from "fastify";
import app from "./app.js";
import { env } from "./utils/env.js";

// Instantiate Fastify with some config
const server = fastify({
  logger: true,
});

server.register(app);

// delay is the number of milliseconds for the graceful close to finish
closeWithGrace(
  { delay: env.CLOSE_GRACE_DELAY },
  async function ({ signal, err, manual }) {
    if (err) {
      server.log.error(err);
    }
    await server.close();
  },
);

// Start listening.
server.listen({ port: env.PORT }, (err) => {
  if (err) {
    server.log.error(err);
    process.exit(1);
  }
});
