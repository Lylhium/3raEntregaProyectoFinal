import winston from "winston";

const customLevelOption = {
  levels: {
    fatal: 0,
    error: 1,
    warning: 2,
    info: 3,
  },

  colors: {
    fatal: "red",
    error: "magenta",
    warning: "yellow",
    info: "blue",
  },
};

const prodLog = winston.createLogger({
  level: customLevelOption,
  transports: [
    new winston.transports.Console({
      level: "info",
      format: winston.format.combine(
        winston.format.colorize({ colors: customLevelOption.colors }),
        winston.format.simple()
      ),
    }),
    new winston.transports.File({
      filename: "logs/errors.log",
      level: "fatal",
      format: winston.format.simple(),
    }),
    new winston.transports.File({
      filename: "logs/errors.log",
      level: "error",
      format: winston.format.simple(),
    }),
  ],
});

export default prodLog;
