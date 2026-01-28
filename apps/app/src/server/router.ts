import { createRouter } from "./trpc";
import { textTemplatesRouter } from "./routers/text-templates";
import { videoRouter } from "./routers/video";

export const router = createRouter({
  textTemplates: textTemplatesRouter,
  video: videoRouter,
});

export type Router = typeof router;
