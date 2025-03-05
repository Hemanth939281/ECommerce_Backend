const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const mongodbConnection = require("./db/mongodbConnection");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const app = express();
mongodbConnection();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(bodyParser.json());
app.use(cookieParser());
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

const port = process.env.PORT || 5000;

// Swagger Configuration
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Rakshakh API Documentation",
      version: "1.0.0",
      description: "API documentation for Users, Categories, Uploads, Products, and Cart",
    },
    servers: [
      {
        url: `http://localhost:${port}`,
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
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ["./routes/*.js"], // Load API docs from routes folder
};

// Initialize Swagger
const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.get("/", (req, res) => {
  res.send("Hello I'm Rakshakh");
});

// API Routes
app.use("/users", require("./routes/userRouter"));
app.use("/api", require("./routes/categoryRouter"));
app.use("/api", require("./routes/upload"));
app.use("/api", require("./routes/productRouter"));
app.use("/api", require("./routes/cartRouter"));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(`Swagger Docs available at http://localhost:${port}/api-docs`);
});
