import dotenv from "dotenv";
import express, { json, urlencoded } from "express";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerOptions from "./swaggerOptions";
import ApiRoutes from "./api";
import fileUpload from "express-fileupload";

// Get environment - Default develop
const args = process.argv.slice(2);
const environment = args[0] || "dev";
const getDotenvFilePath = (): string => {
  let path = "./.env.development";
  if (environment === "test") path = "./.env.test";
  return path;
};

dotenv.config({ path: getDotenvFilePath() });

// initialization
const server = express();

// settings
server.set("port", process.env.PORT || 3000);

// middlewares
server.use(morgan("common"));
server.use(urlencoded({ extended: false }));
server.use(json());
server.use(
  fileUpload({
    createParentPath: true,
  })
);
if (process.env.FILES_PATH)
  server.use("/static", express.static(process.env.FILES_PATH));

// Swagger
const specs = swaggerJsdoc(swaggerOptions);
server.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(specs, {
    customSiteTitle: "Documentación de REST APIs - Harweb Bridge",
  })
);

// routes
ApiRoutes(server);

export default server;
