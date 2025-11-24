import express from "express";
import Service from "@models/services";
import { ServiceType } from "@custom-types/types";
import { Error } from "mongoose";
import { withUser, requireRole } from "@utils/middleware";

const router = express.Router();

// GET /api/services - Obtener todos los servicios (público)
router.get("/", async (_req, res) => {
  const services: Service[] = await Service.find({});
  res.json(services);
});

// GET /api/services/:id - Obtener un servicio por ID (público)
router.get("/:id", async (req, res) => {
  const service: Service | null = await Service.findById(req.params.id);
  if (service) {
    res.json(service);
  } else {
    res.status(404).json({ error: "service not found" });
  }
});

// POST /api/services - Crear un nuevo servicio (solo admin)
router.post(
  "/",
  withUser,
  requireRole("admin"),
  async (req, res) => {
    try {
      const { name, type, description, durationMin, price } = req.body;

      // Validar campos requeridos
      if (!name || !type || !durationMin || price === undefined) {
        return res.status(400).json({
          error: "name, type, durationMin, and price are required",
        });
      }

      // Validar que el tipo sea válido
      const validTypes = Object.values(ServiceType);
      if (!validTypes.includes(type)) {
        return res.status(400).json({
          error: `type must be one of: ${validTypes.join(", ")}`,
        });
      }

      // Validar valores numéricos
      if (durationMin <= 0 || price < 0) {
        return res.status(400).json({
          error: "durationMin must be greater than 0 and price must be non-negative",
        });
      }

      const newService = new Service({
        name,
        type,
        description: description || "",
        durationMin,
        price,
      });

      const savedService = await newService.save();
      res.status(201).json(savedService);
    } catch (error: any) {
      res.status(400).json({
        error: error.message || "Error al crear el servicio",
      });
    }
  },
);

// PUT /api/services/:id - Actualizar un servicio (solo admin)
router.put(
  "/:id",
  withUser,
  requireRole("admin"),
  async (req, res) => {
    try {
      const { name, type, description, durationMin, price } = req.body;

      // Validar que el tipo sea válido si se proporciona
      if (type) {
        const validTypes = Object.values(ServiceType);
        if (!validTypes.includes(type)) {
          return res.status(400).json({
            error: `type must be one of: ${validTypes.join(", ")}`,
          });
        }
      }

      // Validar valores numéricos si se proporcionan
      if (durationMin !== undefined && durationMin <= 0) {
        return res.status(400).json({
          error: "durationMin must be greater than 0",
        });
      }

      if (price !== undefined && price < 0) {
        return res.status(400).json({
          error: "price must be non-negative",
        });
      }

      const updateData: any = {};
      if (name) updateData.name = name;
      if (type) updateData.type = type;
      if (description !== undefined) updateData.description = description;
      if (durationMin) updateData.durationMin = durationMin;
      if (price !== undefined) updateData.price = price;

      const updatedService = await Service.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true, runValidators: true },
      );

      if (updatedService) {
        res.json(updatedService);
      } else {
        res.status(404).json({ error: "service not found" });
      }
    } catch (error: any) {
      res.status(400).json({
        error: error.message || "Error al actualizar el servicio",
      });
    }
  },
);

// DELETE /api/services/:id - Eliminar un servicio (solo admin)
router.delete(
  "/:id",
  withUser,
  requireRole("admin"),
  async (req, res) => {
    try {
      const deletedService = await Service.findByIdAndDelete(req.params.id);
      if (deletedService) {
        res.status(204).end();
      } else {
        res.status(404).json({ error: "service not found" });
      }
    } catch (error: any) {
      res.status(400).json({
        error: error.message || "Error al eliminar el servicio",
      });
    }
  },
);

export default router;
