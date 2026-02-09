import { config } from "./config.ts";
import { app } from "./src/app.ts";
import { logger } from "./src/lib/logger.ts";

// Démarre un serveur
app.listen(config.port, () => {
  console.info(`🚀 Server started at http://localhost:${config.port}`);
});