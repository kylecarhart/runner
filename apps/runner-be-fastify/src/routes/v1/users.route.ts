import { AutoloadPluginOptions } from "@fastify/autoload";
import { FastifyPluginAsync } from "fastify";

export const users: FastifyPluginAsync = async (
  fastify,
  opts,
): Promise<void> => {
  fastify.get("/", async function (request, reply) {
    return "users";
  });
};

export default users;

export const autoConfig: AutoloadPluginOptions = {
  autoPrefix: "/users",
};
