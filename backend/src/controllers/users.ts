import bcrypt from "bcrypt";
import express, { Request, Response } from "express";
import User from "../models/users";
import { withUser, requireRole } from "../utils/middleware";

const router = express.Router();

// GET /api/users - Obtener todos los usuarios (solo admin)
router.get(
  "/",
  withUser,
  requireRole("admin"),
  async (request: Request, response: Response) => {
    const users = await User.find({}).populate("reservations");
    response.json(users);
  },
);

// GET /api/users/barbers - Obtener todos los barberos (público, para selección en reservas)
router.get("/barbers", async (request: Request, response: Response) => {
  try {
    const barbers = await User.find({ role: 'barbero' }).select('id username name email phone');
    response.json(barbers);
  } catch (error: any) {
    response.status(500).json({ error: "Error al obtener los barberos" });
  }
});

// POST /api/users - Registro público (solo puede crear clientes)
router.post("/", async (request: Request, response: Response) => {
  const { username, name, email, password, phone, role } = request.body;

  // Validar que el rol no sea admin o barbero (solo clientes pueden registrarse públicamente)
  if (role && (role === "admin" || role === "barbero")) {
    return response.status(403).json({
      error: "No puedes registrarte con este rol. Contacta a un administrador.",
    });
  }

  if (!password || password.length < 3) {
    return response.status(400).json({
      error: "password must be at least 3 characters long",
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
    role: "cliente", // Siempre cliente para registro público
  });

  try {
    const savedUser = await user.save();
    response.status(201).json(savedUser); // toJSON elimina passwordHash automáticamente
  } catch (error: any) {
    if (error.code === 11000) {
      // Error de duplicado
      const field = Object.keys(error.keyPattern)[0];
      return response.status(400).json({
        error: `${field} already exists`,
      });
    }
    response.status(400).json({ error: error.message });
  }
});

// POST /api/users/first-admin - Crear el primer admin (solo si no hay admins en el sistema)
router.post("/first-admin", async (request: Request, response: Response) => {
  try {
    // Verificar si ya existe un admin
    const existingAdmin = await User.findOne({ role: "admin" });
    if (existingAdmin) {
      return response.status(403).json({
        error:
          "Ya existe un administrador en el sistema. Usa /api/users/admin para crear más.",
      });
    }

    const { username, name, email, password, phone } = request.body;

    if (!password || password.length < 3) {
      return response.status(400).json({
        error: "password must be at least 3 characters long",
      });
    }

    if (!username || !name || !email) {
      return response.status(400).json({
        error: "username, name, and email are required",
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
      role: "admin", // Siempre admin para este endpoint
    });

    const savedUser = await user.save();
    response.status(201).json(savedUser);
  } catch (error: any) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return response.status(400).json({
        error: `${field} already exists`,
      });
    }
    response.status(400).json({ error: error.message });
  }
});

// POST /api/users/admin - Crear usuario (solo admin puede crear barberos y otros admins)
router.post(
  "/admin",
  withUser,
  requireRole("admin"),
  async (request: Request, response: Response) => {
    const { username, name, email, password, phone, role } = request.body;

    // Validar que se proporcione un rol válido
    const validRoles = ["cliente", "barbero", "admin"];
    if (!role || !validRoles.includes(role)) {
      return response.status(400).json({
        error: "role is required and must be one of: cliente, barbero, admin",
      });
    }

    if (!password || password.length < 3) {
      return response.status(400).json({
        error: "password must be at least 3 characters long",
      });
    }

    // Validar campos requeridos
    if (!username || !name || !email) {
      return response.status(400).json({
        error: "username, name, and email are required",
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
      role,
    });

    try {
      const savedUser = await user.save();
      response.status(201).json(savedUser); // toJSON elimina passwordHash automáticamente
    } catch (error: any) {
      if (error.code === 11000) {
        // Error de duplicado
        const field = Object.keys(error.keyPattern)[0];
        return response.status(400).json({
          error: `${field} already exists`,
        });
      }
      response.status(400).json({ error: error.message });
    }
  },
);

export default router;
