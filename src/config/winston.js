const winston = require("winston");
const { format } = require("winston");
require("winston-mongodb");
const MongoClient = require("mongodb").MongoClient;

const logger = winston.createLogger({
  level: "info",
  transports: [
    new winston.transports.File({
      filename: "logs/error.logstash.log",
      level: "error",
      format: format.combine(
        format.timestamp(),
        format.logstash(),
        format.errors({ stack: true })
      ),
    }),
    new winston.transports.File({
      filename: "logs/info.logstash.log",
      level: "info",
      format: format.combine(format.timestamp(), format.logstash()),
    }),
    new winston.transports.File({
      filename: "logs/error.json.log",
      level: "error",
      format: format.combine(
        format.timestamp(),
        format.json(),
        format.errors({ stack: true })
      ),
    }),
    new winston.transports.File({
      filename: "logs/info.json.log",
      level: "info",
      format: format.combine(format.timestamp(), format.json()),
    }),
  ],
});

function requestLogger(req, res, next) {
  logger.info({
    method: req.method,
    url: req.originalUrl,
    headers: req.headers,
    protocol: req.protocol,
    hostname: req.hostname,
    ip: req.ip,
  });
  next();
}

const setupMongoDB = async () => {
  const client = new MongoClient(process.env.MONGODB_URL);
  try {
    await client.connect();
    const transportOptions = {
      db: await Promise.resolve(client),
      collection: "logs",
    };
    logger.add(new winston.transports.MongoDB(transportOptions));
    logger.info("Connection to MongoDB has been established successfully.");
  } catch (error) {
    logger.error(`Unable to connect to the MongoDB: ${error.message}|${error.stack}`);
  }
};

if (process.env.LOGGING_TO_MONGO == "true") {
  setupMongoDB();
}

module.exports = {
  logger,
  requestLogger,
};
