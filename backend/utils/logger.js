/**
 * Custom Logger utility for backend requests and application status.
 */
const logger = {
  info: (message, ...args) => {
    const timestamp = new Date().toISOString();
    console.log(`\x1b[36m[${timestamp}] INFO: ${message}\x1b[0m`, ...args);
  },
  success: (message, ...args) => {
    const timestamp = new Date().toISOString();
    console.log(`\x1b[32m[${timestamp}] SUCCESS: ${message}\x1b[0m`, ...args);
  },
  warn: (message, ...args) => {
    const timestamp = new Date().toISOString();
    console.warn(`\x1b[33m[${timestamp}] WARN: ${message}\x1b[0m`, ...args);
  },
  error: (message, ...args) => {
    const timestamp = new Date().toISOString();
    console.error(`\x1b[31m[${timestamp}] ERROR: ${message}\x1b[0m`, ...args);
  },
};

export default logger;
