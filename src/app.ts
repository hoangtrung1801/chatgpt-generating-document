import { CREDENTIALS, LOG_FORMAT, NODE_ENV, ORIGIN, PORT } from "@config";
import { Routes } from "@interfaces/routes.interface";
import errorMiddleware from "@middlewares/error.middleware";
import { logger, stream } from "@utils/logger";
import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import hpp from "hpp";
import morgan from "morgan";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Server as SocketServer } from "socket.io";
import handleSocket from "./socket";

class App {
  public app: express.Application;
  public env: string;
  public port: string | number;
  public io: SocketServer;

  constructor(routes: Routes[]) {
    this.app = express();
    this.env = NODE_ENV || "development";
    this.port = PORT || 3000;

    this.initializeMiddlewares();
    this.initializeRoutes(routes);
    this.initializeSwagger();
    this.initializeErrorHandling();
  }

  public listen() {
    const server = this.app.listen(this.port, () => {
      logger.info(`=================================`);
      logger.info(`======= ENV: ${this.env} =======`);
      logger.info(`🚀 App listening on the port ${this.port}`);
      logger.info(`=================================`);
    });
    server.setTimeout(1000 * 60 * 5);

    this.io = new SocketServer(server, {
      cors: {
        origin: "*",
      },
    });
    this.io.on("connection", handleSocket);
  }

  public getServer() {
    return this.app;
  }

  private initializeMiddlewares() {
    this.app.use(morgan(LOG_FORMAT, { stream }));
    this.app.use(cors({ origin: ORIGIN, credentials: CREDENTIALS }));
    this.app.use(hpp());
    this.app.use(helmet());
    this.app.use(compression());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser());
  }

  private initializeRoutes(routes: Routes[]) {
    routes.forEach(route => {
      this.app.use("/", route.router);
    });
  }

  private initializeSwagger() {
    const options: swaggerJSDoc.Options = {
      // swaggerDefinition: {
      // //   info: {
      //     title: "REST API",
      //     version: "1.0.0",
      //     description: "Example docs",
      //   },
      // },
      // apis: ["./src/routes/*.ts", "swagger.yaml"],
      definition: {
        info: {
          title: "REST API",
          version: "1.0.0",
        },
        openapi: "3.0.2",
      },
      apis: ["swagger.yaml"],
    };

    const specs = swaggerJSDoc(options);
    this.app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs, { explorer: true }));
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }
}

export default App;
