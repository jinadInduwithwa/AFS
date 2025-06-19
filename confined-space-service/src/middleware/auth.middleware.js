// confined-space-service/src/middleware/auth.middleware.js
import axios from "axios";
import { config } from "../config/config.js";

console.log("Auth Service URL:", config.authServiceUrl); // Debug: Verify URL

// Middleware to authenticate requests by verifying token with Auth Service
export const authenticate = async (req, res, next) => {
  try {
    // Log headers and cookies
    console.log("Headers:", req.headers);
    console.log("Cookies:", req.cookies);

    // Get token from header or cookie
    const token =
      req.header("Authorization")?.replace("Bearer ", "") || req.cookies.token;

    console.log("Extracted token:", token); // Debug: Verify token

    if (!token) {
      return res
        .status(401)
        .json({ message: "No token, authorization denied" });
    }

    // Call Auth Service's /verify endpoint
    console.log("Calling /verify at:", `${config.authServiceUrl}/verify`); // Debug
    const response = await axios.post(
      `${config.authServiceUrl}/verify`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 5000,
      }
    );

    console.log("Auth Service response:", response.data); // Debug

    // Attach user data to request
    if (response.status === 200 && response.data.user) {
      req.user = {
        userId: response.data.user.id || response.data.user._id, // Handle both id and _id
        role: response.data.user.role,
        email: response.data.user.email,
      };
      console.log("Attached user:", req.user); // Debug
      next();
    } else {
      return res.status(401).json({ message: "Invalid token" });
    }
  } catch (error) {
    console.error("Authentication error:", error.response?.data || error.message);
    return res
      .status(401)
      .json({ message: "Authentication failed", error: error.message });
  }
};

// Middleware to authorize based on role
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        message: "You do not have permission to perform this action",
      });
    }
    next();
  };
};