import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "AgroAI Backend API",
      version: "1.0.0",
      description: "Complete API documentation for AgroAI - Agricultural Intelligence Platform",
      contact: {
        name: "AgroAI Team",
        email: "support@agroai.com",
      },
    },
    servers: [
      {
        url: "http://localhost:4000",
        description: "Local Development Server",
      },
      {
        url: "https://agroai-backend-api-production.up.railway.app",
        description: "Production Server",
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
        User: {
          type: "object",
          properties: {
            _id: { type: "string" },
            name: { type: "string" },
            email: { type: "string" },
            number: { type: "string" },
            user_type: { type: "string", enum: ["farmer", "expert"] },
            image: { type: "string" },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        Farmer: {
          type: "object",
          properties: {
            _id: { type: "string" },
            name: { type: "string" },
            email: { type: "string" },
            number: { type: "string" },
            location: { type: "string" },
            crops_type: { type: "string" },
            user_type: { type: "string", enum: ["farmer"] },
            image: { type: "string" },
          },
        },
        Expert: {
          type: "object",
          properties: {
            _id: { type: "string" },
            name: { type: "string" },
            email: { type: "string" },
            number: { type: "string" },
            expertise: { type: "string" },
            experiance: { type: "string" },
            bio: { type: "string" },
            user_type: { type: "string", enum: ["expert"] },
            image: { type: "string" },
          },
        },
        Error: {
          type: "object",
          properties: {
            error: { type: "string" },
            message: { type: "string" },
            statusCode: { type: "number" },
          },
        },
      },
    },
    tags: [
      {
        name: "Health",
        description: "Health check endpoints",
      },
      {
        name: "Auth",
        description: "Authentication and user management",
      },
      {
        name: "Predictions",
        description: "Crop prediction and recommendation",
      },
    ],
  },
  apis: ["./dist/routes/*.js", "./dist/controllers/*.js"],
};

export const swaggerSpec = swaggerJsdoc(options);
