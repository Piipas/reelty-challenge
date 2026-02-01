import z from "zod";

export const renderSchema = z.object({
  texts: z.array(
    z.object({
      template: z.string(),
      start: z.number(),
      duration: z.number(),
      animationData: z.any(),
    }),
  ),
  clips: z.array(
    z.object({
      url: z.string(),
      duration: z.number(),
    }),
  ),
});
