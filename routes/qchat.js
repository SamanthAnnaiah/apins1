const express = require("express");
const { body, validationResult } = require("express-validator");
const {
  qchatcontroller,
  geminiChatController,
  geminiMultimodalController,
} = require("../controllers/qchatcontroller");
const qchatrouter = express.Router();

qchatrouter.post("/", qchatcontroller);

// Add validation middleware for the Gemini route
qchatrouter.post(
  "/gemini",
  [
    // Sanitize and validate the input
    body("aiq").trim().escape().notEmpty().withMessage("Question is required"),

    // Check for validation errors
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array(),
        });
      }
      next();
    },
  ],
  geminiChatController
);

// Add validation middleware for the Gemini multimodal route
qchatrouter.post(
  "/gemini-vision",
  [
    // Sanitize and validate the input
    body("prompt").trim().escape().notEmpty().withMessage("Prompt is required"),
    body("imageUrls").isArray().withMessage("Image URLs must be an array"),
    body("imageUrls.*")
      .isURL()
      .withMessage("Each image URL must be a valid URL"),

    // Check for validation errors
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array(),
        });
      }
      next();
    },
  ],
  geminiMultimodalController
);

module.exports = qchatrouter;
