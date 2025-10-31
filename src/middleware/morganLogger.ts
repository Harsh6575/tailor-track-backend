import morgan, { StreamOptions } from "morgan";
import logger from "../utils/logger.js";

// Define stream to write Morgan logs via Winston
const stream: StreamOptions = {
  write: (message) => logger.http(message.trim()),
};

// Skip logging in test environment
const skip = () => process.env.NODE_ENV === "test";

// Morgan log format (custom, but you can adjust)
const morganFormat = ":method :url :status :res[content-length] - :response-time ms";

const morganLogger = morgan(morganFormat, { stream, skip });

export default morganLogger;
