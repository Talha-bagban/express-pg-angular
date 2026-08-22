const isProduction = process.env.NODE_ENV === "production";

class LogHelper {
  static getTime() {
    const now = new Date();
    const ist = new Date(now.getTime() + 5.5 * 60 * 60 * 1000);

    return ist.toISOString().slice(0, -1);
  }

  static info(message, ...args) {
    const ist = this.getTime();
    console.log(`[INFO]  [IST ${ist}] - ${message}`, ...args);
  }

  static error(message, ...args) {
    const ist = this.getTime();
    console.error(`[ERROR] [IST ${ist}] - ${message}`, ...args);
  }

  static warn(message, ...args) {
    const ist = this.getTime();
    console.warn(`[WARN]  [IST ${ist}] - ${message}`, ...args);
  }

  static debug(message, ...args) {
    if (!isProduction) {
      const ist = this.getTime();
      console.debug(`[DEBUG] [IST ${ist}] - ${message}`, ...args);
    }
  }
}

export const logger = (req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;

    const ip =
      req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
      req.socket?.remoteAddress ||
      req.ip ||
      "unknown";

    const url = req.originalUrl || req.url;

    const logMessage = `[${ip}] ${req.method} ${url} ${res.statusCode} - [${duration}ms]`;

    if (res.statusCode >= 500) {
      LogHelper.error(logMessage);
    } else if (res.statusCode >= 400) {
      LogHelper.warn(logMessage);
    } else {
      LogHelper.info(logMessage);
    }
  });

  next();
};
