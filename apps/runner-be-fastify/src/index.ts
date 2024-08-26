import fastifyAutoload from "@fastify/autoload";
import fastify from "fastify";
import path from "path";
import postgres from "postgres";
import { fileURLToPath } from "url";
import { env } from "./utils/env.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const server = fastify();

const client = postgres({
  host: env.DB_HOST,
  port: env.DB_PORT,
  database: env.DB_NAME,
  username: env.DB_USERNAME,
  password: env.DB_PASSWORD,
});

/** Autoload plugins */
// server.register(fastifyAutoload, {
//   dir: path.join(__dirname, "plugins"),
//   forceESM: true,
// });

/** Autoload routes */
server.register(fastifyAutoload, {
  dir: path.join(__dirname, "routes/v1"),
  options: {
    prefix: "/api/v1",
  },
  forceESM: true,
});

server.listen({ port: 8080 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
