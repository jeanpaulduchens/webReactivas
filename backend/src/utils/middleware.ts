import e, { NextFunction, Request, Response } from "express";
import logger from "@utils/logger";
import jwt from "jsonwebtoken";
import config from "@utils/config";

const requestLogger = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  console.log("Method:", request.method);
  console.log("Path:  ", request.path);
  console.log("Body:  ", request.body);
  console.log("---");
  next();
};

const unknownEndpoint = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  response.status(404).send({ error: "unknown endpoint" });
};

const errorHandler = (
  error: { name: string; message:string },
  request: Request,
  response: Response,
  next: NextFunction
) => {
  logger.error(error.message);

  logger.error(error.name);
  if (error.name === "CastError") {
    response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    response.status(400).json({ error: error.message });
  } else if (
    error.name === "MongoServer Error" &&
    error.message.includes("E11000 duplicate key error collection")
  ) {
    response
      .status(400)
      .json({ error: "duplicate key error" });
  } else if (error.name === "JsonWebTokenError") {
    response.status(401).json({ error: "invalid token" });
  } else if (error.name === "TokenExpiredError") {
    response.status(401).json({ error: "invalid token" });
  }
  next(error);
};

export default {
  requestLogger,
  unknownEndpoint,
  errorHandler,
};