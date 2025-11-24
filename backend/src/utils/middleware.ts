import e, { NextFunction, Request, Response } from "express";
import logger from "@utils/logger";
import jwt from "jsonwebtoken";
import config from "@utils/config";

// Request extendido para incluir userId y userRole
declare global {
  namespace Express {
    interface Request {
      userId?: string;
      userRole?: string;
    }
  }
}

const requestLogger = (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  console.log("Method:", request.method);
  console.log("Path:  ", request.path);
  console.log("Body:  ", request.body);
  console.log("---");
  next();
};

const unknownEndpoint = (request: Request, response: Response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

const errorHandler = (
  error: { name: string; message: string },
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  logger.error(error.message);

  logger.error(error.name);
  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  } else if (
    error.name === "MongoServerError" &&
    error.message.includes("E11000 duplicate key error")
  ) {
    return response
      .status(400)
      .json({ error: "expected `username` to be unique" });
  } else if (error.name === "JsonWebTokenError") {
    return response.status(401).json({ error: "invalid token" });
  } else if (error.name === "TokenExpiredError") {
    return response.status(401).json({ error: "token expired" });
  }
  next(error);
};

// Middleware de autenticación
export const withUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      res.status(401).json({ error: "token missing" });
      return;
    }

    const decodedToken = jwt.verify(token, config.JWT_SECRET);
    const csrfToken = req.headers["x-csrf-token"];

    if (
      typeof decodedToken === "object" &&
      decodedToken.id &&
      decodedToken.csrf === csrfToken
    ) {
      req.userId = decodedToken.id;
      req.userRole = decodedToken.role;
      next();
    } else {
      res.status(401).json({ error: "invalid token" });
    }
  } catch (error) {
    res.status(401).json({ error: "invalid token" });
  }
};

// Middleware para verificar roles específicos
export const requireRole = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.userRole) {
      return res.status(401).json({ error: "authentication required" });
    }

    if (!allowedRoles.includes(req.userRole)) {
      return res.status(403).json({
        error: "insufficient permissions",
      });
    }

    next();
  };
};

export default {
  requestLogger,
  unknownEndpoint,
  errorHandler,
};
