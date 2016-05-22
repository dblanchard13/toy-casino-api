module.exports = {
  // disbable logging for production
  loggingOff: true,
  db: {
    url: process.env.MONGODB_URI
  }
};
