// Solo usar module-alias en producción (cuando el código está compilado)
if (process.env.NODE_ENV === 'production') {
  require('module-alias/register');
}

import app from "./app";
import config from "@utils/config";
import logger from "@utils/logger";

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

app.listen(config.PORT, () => {
  logger.info(`Server running on http://${config.HOST}:${config.PORT}`);
});