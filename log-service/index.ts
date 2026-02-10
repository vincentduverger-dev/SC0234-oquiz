import express from "express";
import { logRouter } from "./src/log.router.js";

const app = express();
const PORT = Number(process.env.PORT) || 3002;

app.use(express.json());
app.use("/api/logs", logRouter);

app.listen(PORT, () => {
  console.info(`🚀 Log service started at http://localhost:${PORT}`);
});