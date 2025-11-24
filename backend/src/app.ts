import express, { NextFunction, Request, Response } from "express";
import cookieParser from "cookie-parser";
import logger from "@utils/logger";
import config from "@utils/config";
import mongoose from "mongoose";
import middleware from "@utils/middleware";
import servicesRouter from "@controllers/services";
import hoursRouter from "@controllers/hours";
import reservationsRouter from "@controllers/reservations";
import usersRouter from "@controllers/users";
import loginRouter from "@controllers/login";
import { seedServices } from "@utils/seedServices";

const app = express();

mongoose.set("strictQuery", false);

if (config.MONGODB_URI) {
  const connectionOptions = config.MONGODB_DBNAME 
    ? { dbName: config.MONGODB_DBNAME }
    : {};
    
  mongoose
    .connect(config.MONGODB_URI, connectionOptions)
    .then(async () => {
      logger.info(`Connected to MongoDB - Database: ${config.MONGODB_DBNAME || 'default'}`);
      try {
        await seedServices();
        logger.info("Services seeded successfully");
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        logger.error("Error seeding services:", errorMessage);
      }
    })
    .catch((error) => {
      logger.error("Error connecting to MongoDB:", error.message);
    });
}

app.use(express.static("dist"));
app.use(express.json());
app.use(cookieParser());
app.use(middleware.requestLogger);

// Definimos nuestras rutas aquí
app.use("/api/users", usersRouter);
app.use("/api/login", loginRouter);
app.use("/api/services", servicesRouter);
app.use("/api/hours", hoursRouter);
app.use("/api/reservations", reservationsRouter);
app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

export default app;
