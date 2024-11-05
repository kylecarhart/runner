import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z); // This adds `.openapi()` to the schemas

export * from "./request.js";
export * from "./response.js";
export * from "./user.js";
