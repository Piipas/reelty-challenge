import { Router } from "express";
import { renderController, renderProgressController } from "../controllers/video";

const router: Router = Router();
router.post("/render", renderController);
router.get("/render/job/:id", renderProgressController);

export default router;
