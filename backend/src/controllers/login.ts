import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import express, { Request, Response } from "express";
import User from "../models/users";
import config from "../utils/config";
import { withUser } from "../utils/middleware";

const router = express.Router();

// LOGIN
router.post("/", async (request: Request, response: Response) => {
  const { username, password } = request.body;

  const user = await User.findOne({ username });

  if (!user) {
    return response.status(401).json({
      error: "invalid username or password",
    });
  }

  const passwordCorrect = await bcrypt.compare(password, user.passwordHash);

  if (!passwordCorrect) {
    return response.status(401).json({
      error: "invalid username or password",
    });
  }

  const userForToken = {
    username: user.username,
    id: user._id,
    role: user.role,
    csrf: crypto.randomUUID(),
  };

  const token = jwt.sign(userForToken, config.JWT_SECRET, {
    expiresIn: 60 * 60,
  });

  response.setHeader("X-CSRF-Token", userForToken.csrf);
  response.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });

  response.status(200).json({
    username: user.username,
    name: user.name,
    email: user.email,
    role: user.role,
    id: user.id,
  });
});

router.post("/logout", (request: Request, response: Response) => {
  response.clearCookie("token");
  response.status(200).json({
    message: "Logged out successfully",
  });
});

// Verificar sesión actual
router.get("/me", withUser, async (request: Request, response: Response) => {
  const user = await User.findById(request.userId);
  response.status(200).json(user);
});

export default router;
