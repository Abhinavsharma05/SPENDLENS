require('dotenv').config();
const express = require("express");
const cors = require("cors");
const auditLimiter = require("./middleware/rateLimit");
const auditRoutes = require("./routes/audit");
const leadRoutes = require("./routes/leads");
const errorHandler = require("./middleware/errorHandler");

const app = express();

// Middleware
app.use(cors({
  origin: [process.env.FRONTEND_URL, "https://spendlens-1.onrender.com", "http://localhost:5173", "http://localhost:5174"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());
app.use("/api", auditLimiter); // Apply rate limit to all api routes

// Routes
app.use("/api/audit", auditRoutes);
app.use("/api/leads", leadRoutes);

// Health check
app.get("/health", (req, res) => res.json({ status: "ok" }));

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
