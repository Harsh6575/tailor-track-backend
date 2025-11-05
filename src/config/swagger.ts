import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import path from "path";
import { fileURLToPath } from "url";
import { Express } from "express";
import logger from "../utils/logger.js";

// Needed for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const setupSwagger = (app: Express) => {
  const options: swaggerJSDoc.Options = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Tailor Track API",
        version: "1.0.0",
        description: "API documentation for Tailor Track backend",
      },
      servers: [
        {
          url: "http://localhost:4000",
          description: "Development server",
        },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
        },
        schemas: {
          RegisterUser: {
            type: "object",
            required: ["name", "email", "password"],
            properties: {
              name: { type: "string", example: "Harsh Vansjaliya" },
              email: { type: "string", example: "harsh@example.com" },
              password: { type: "string", example: "Pass@123" },
            },
          },
          LoginUser: {
            type: "object",
            required: ["email", "password"],
            properties: {
              email: { type: "string", example: "harsh@example.com" },
              password: { type: "string", example: "Pass@123" },
            },
          },
        },
      },
    },
    apis: [
      // ✅ Works in both dev and build
      path.resolve(__dirname, "../modules/**/*.routes.ts"),
      path.resolve(__dirname, "../modules/**/*.routes.js"),
    ],
  };

  const swaggerSpec = swaggerJSDoc(options);

  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  logger.info("📘 Swagger docs available at http://localhost:4000/api-docs");
};
