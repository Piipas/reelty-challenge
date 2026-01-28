import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createRouter, publicProcedure } from "../trpc";
import { replaceAnimationPlaceholder } from "../utils";
import { readFileSync } from "fs";
import { join } from "path";

const TEMPLATE_METADATA = [
  { id: "47f9be7b-4d39-4d10-a477-08c0cb589e78", name: "Lines", key: "lines", limit: 30 },
  { id: "5d614889-0b7a-46f6-8415-2ff1087da8d5", name: "Static", key: "static", limit: null },
  { id: "a3f9264d-d70a-444b-bb16-b6d5f42386d2", name: "Staggered up", key: "staggered_up", limit: null },
  { id: "c6bf6842-04d1-41b6-a24a-24e77429af67", name: "Box animation", key: "box_animation", limit: 25 },
];

function loadTemplate(key: string): any {
  try {
    const filePath = join(process.cwd(), "src", "server", "data", "text-templates", `${key}.json`);
    const fileContent = readFileSync(filePath, "utf-8");
    return JSON.parse(fileContent);
  } catch {
    throw new TRPCError({ code: "NOT_FOUND", message: `Template file not found for key: ${key}` });
  }
}

export const textTemplatesRouter = createRouter({
  getAll: publicProcedure.query(async () => {
    return TEMPLATE_METADATA.map((meta) => ({ ...meta, content: loadTemplate(meta.key) }));
  }),

  getByKey: publicProcedure
    .input(z.object({ key: z.string(), text: z.string().optional() }))
    .query(async ({ input }) => {
      const template = TEMPLATE_METADATA.find((t) => t.key === input.key);
      if (!template) throw new TRPCError({ code: "NOT_FOUND", message: `Text template with key "${input.key}" not found` });
      const content = loadTemplate(template.key);
      if (input.text) return { ...template, content: replaceAnimationPlaceholder(content, input.text) };
      return { ...template, content };
    }),
});
