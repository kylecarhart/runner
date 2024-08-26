import { FastifyPluginAsync } from "fastify";

export const root: FastifyPluginAsync = async (
  fastify,
  opts,
): Promise<void> => {
  fastify.get("/", async function (request, reply) {
    return { root: true };
  });
};

export default root;
