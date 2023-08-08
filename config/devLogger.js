import winston from "winston";

const customLevels = {
  levels: {
    fatal: 0,
    error: 1,
    warning: 2,
    info: 3,
    debug: 4,
  },
  colors: {
    fatal: "red",
    error: "magenta",
    warning: "yellow",
    info: "blue",
    debug: "white",
  },
};

const log = winston.createLogger({
  levels: customLevels.levels,
  format: winston.format.combine(
    winston.format.colorize({ colors: customLevels.colors }),
    winston.format.simple()
  ),
  transports: [
    new winston.transports.Console({
      level: "debug",
    }),
    new winston.transports.File({
      filename: "logs/errors.log",
      level: "fatal",
    }),
    new winston.transports.File({
      filename: "logs/errors.log",
      level: "error",
    }),
  ],
});

winston.addColors(customLevels.colors);

export default log;
