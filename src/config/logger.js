const path = require("path");

let logger = undefined;

function defaultLogger(customLogger) {
  if (customLogger) {
    logger = customLogger;

    // Default logger
  } else {
    const { createLogger, format, transports } = require("winston");
    const {
      combine,
      timestamp,
      errors,
      splat,
      json,
      colorize,
      simple
    } = format;

    logger = createLogger({
      level: "info",
      format: combine(
        timestamp({
          format: "YYYY-MM-DD HH:mm:ss"
        }),
        errors({ stack: true }),
        splat(),
        json()
      ),
      defaultMeta: { service: process.env.SERVICE_NAME || "TTN LoRaWAN" },

      transports: [
        new transports.File({
          filename: path.join("log", "ttn-error.log"),
          level: "error"
        })

        // new transports.File({
        //   filename: path.join("log", "ttn-info.log"),
        //   level: "info"
        // })
      ]
    });

    // if (process.env.NODE_ENV !== "production") {
    //   logger.add(
    //     new transports.Console({
    //       format: combine(colorize(), simple())
    //     })
    //   );
    // }
  }

  return logger;
}

module.exports = defaultLogger();
