import express from "express";
import RenderRouter from "./routes/video";
import cors from "cors";
import path from "path";

const PORT = Number(process.env.PORT) || 3001;

const app = express();
app.use(cors({ origin: ["http://localhost:3000", "http://localhost:3001"] }));
app.use(express.static(path.join(__dirname, "../renders")));
app.use(express.json());
app.use("/api", RenderRouter);

app.listen(PORT, () => {
  console.info(`Render server running on port ${PORT}`);
});
