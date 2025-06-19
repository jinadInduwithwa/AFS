// confined-space-service/src/config/config.js
export const config = {
  authServiceUrl: process.env.AUTH_SERVICE_URL || "http://localhost:3002/api/auth",
};