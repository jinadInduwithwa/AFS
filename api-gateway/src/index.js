import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// Middleware
app.use(
  cors({
    origin: "*", // Allow all origins in development
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(morgan("dev"));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`, {
    body: req.body,
    headers: req.headers,
  });
  next();
});

// Proxy configuration
const proxyOptions = {
  changeOrigin: true,
  secure: false,
  timeout: 30000, // 30 seconds timeout
  proxyTimeout: 30000,
  onError: (err, req, res) => {
    console.error("Proxy Error:", err);
    res.status(500).json({
      message: "Service is currently unavailable",
      error: err.message,
    });
  },
  onProxyReq: (proxyReq, req, res) => {
    console.log("Proxying request:", req.method, req.url);
    if (
      req.body &&
      req.headers["content-type"] &&
      req.headers["content-type"].includes("application/json")
    ) {
      const bodyData = JSON.stringify(req.body);
      proxyReq.setHeader("Content-Length", Buffer.byteLength(bodyData));
      proxyReq.write(bodyData);
    }
  },
  onProxyRes: (proxyRes, req, res) => {
    console.log("Received response:", proxyRes.statusCode);
  },
};

// Auth Service Proxy
app.use(
  "/api/auth",
  createProxyMiddleware({
    target: process.env.AUTH_SERVICE_URL,
    ...proxyOptions,
    pathRewrite: {
      "^/api/auth": "/api/auth",
    },
  })
);


// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
  console.log(`Auth Service URL: ${process.env.AUTH_SERVICE_URL}`);
});
