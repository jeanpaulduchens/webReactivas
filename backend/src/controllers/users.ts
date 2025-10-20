import bcrypt from "bcrypt";
import express, { Request, Response } from "express";
import User from "../models/users";

const router = express.Router();


router.get("/", async (request: Request, response: Response) => {
  const users = await User.find({}).populate("reservations");
  response.json(users);
});


router.post("/", async (request: Request, response: Response) => {
  const { username, name, email, password, phone, role } = request.body;

  if (!password || password.length < 3) {
    return response.status(400).json({ 
      error: "password must be at least 3 characters long" 
    });
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new User({
    username,
    name,
    email,
    passwordHash,
    phone,
    role: role || 'cliente' // Default: cliente
  });

  const savedUser = await user.save();

  response.status(201).json(savedUser); // toJSON elimina passwordHash automáticamente
});

export default router;