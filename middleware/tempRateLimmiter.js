// middlewares/tempRateLimiter.js

const requestLogs = new Map(); // IP => array of timestamps

const tempRateLimiter = (req, res, next) => {
  const key = `${req.ip}:${req.originalUrl}`; // unique per route per IP
  const now = Date.now();
  const WINDOW_TIME = 60 * 100; // 1 min window
  const MAX_REQUESTS = 10;

  if (!requestLogs.has(key)) {
    requestLogs.set(key, []);
  }

  // Filter out old timestamps
  const timestamps = requestLogs
    .get(key)
    .filter((ts) => now - ts < WINDOW_TIME);

  if (timestamps.length >= MAX_REQUESTS) {
    return res.status(429).json({
      error: "Too many requests! Please wait a bit.",
    });
  }

  timestamps.push(now);
  requestLogs.set(key, timestamps);

  next();
};

module.exports = tempRateLimiter;
