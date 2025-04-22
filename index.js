require("dotenv").config();
const express = require("express");
const app = express();
const compression = require("compression");
const cors = require("cors");
const helmet = require("helmet");
const { port } = require("./config");
const boom = require("express-boom");
const Joi = require("joi");
const morgan = require("morgan");
const scriptRunner = require("./lib/run-script");

// Schema for validating incoming requests
const schema = Joi.object({
  'path': Joi.string().required(),
  'container_name': Joi.string().required()
});

// Advanced logging: log all requests and errors
app.use(morgan("combined"));
app.use(helmet());
app.use(express.json());
app.use(compression());
app.use(boom());

// CORS configuration
app.use(
  cors({
    origin: "https://registry.hub.docker.com",
    methods: ["POST"],
    credentials: true,
    maxAge: 3600,
  })
);

// Utility to parse data and extract path by tag
const parseData = (data, tag) => {
  if (!data) throw new Error("Invalid Data");
  if (Array.isArray(data)) {
    const dt = data.find((e) => e.split("|")[1] === tag);
    if (!dt) throw new Error("Invalid Tag");
    return dt.split("|")[0];
  }
  return data.split("|")[0];
};

// Advanced /trigger endpoint with validation, logging, and error handling
app.post("/trigger", async (req, res, next) => {
  try {
    // Log incoming request
    console.log("[/trigger] Incoming request:", {
      query: req.query,
      body: req.body,
    });

    // Validate query parameters

    const { value, error } = await schema.validate(req.query);
    if (error) {
      console.error("[/trigger] Validation error:", error);
      return res.status(400).json({
        state: "failure",
        description: error.details ? error.details[0].message : error.message,
      });
    }

    const { container_name,path } = value;
     

    // Extract repo and tag from body
    const { repository, push_data } = req.body;
    if (!repository || !push_data) {
      console.error("[/trigger] Missing repository or push_data in body");
      return res.status(400).json({
        state: "failure",
        description: "Missing repository or push_data in body",
      });
    }
    const { repo_name } = repository;
    const { tag } = push_data;

    // Parse path from data and tag
    console.log("[/trigger] Parsed path:", path);

    // Run the script with repo and path
    console.log("[/trigger] Running scriptRunner with:", {
      repo_name,
      args: [`${repo_name}:${tag}`, path],
    });
    
   scriptRunner({ args: [`${repo_name}:${tag}`, path,container_name] });

    // Success response
    console.log("[/trigger] Success: Image pulled and launched");
    return res.json({
      state: "success",
      description: `Image ${repo_name} Pulled and Launched successfully`,
    });
  } catch (err) {
    // Log and forward error to centralized error handler
    console.error("[/trigger] Error:", err);
    next(err);
  }
});

// Centralized error handler for all routes
app.use((err, req, res, next) => {
  console.error("[Error Handler]", err);
  res.status(500).json({
    state: "error",
    description: err.message || "Internal Server Error",
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
