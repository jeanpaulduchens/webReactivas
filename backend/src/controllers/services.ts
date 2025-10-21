import express from "express";
import Service from "@models/services";
import { ServiceType } from "@custom-types/types";
import { Error } from "mongoose";

const router = express.Router();

// Eliminar todos los servicios
router.delete("/", async (_req, res) => {
  await Service.deleteMany({});
  res.status(204).end();
});
router.get("/", async (_req, res) => {
  const services: Service[] = await Service.find({});
  res.json(services);
});

router.get("/:id", async (req, res) => {
  const service: Service | null = await Service.findById(req.params.id);
  if (service) {
    res.json(service);
  } else {
    res.status(404).end();
  }
});

router.post("/", async (req, res) => {
  try {
    const { name, durationMin, price } = req.body;
    const newService = new Service({ name, durationMin, price });
    const savedService = await newService.save();
    res.status(201).json(savedService);
  } catch (error) {
    res.status(400).json({ error: error });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { name, durationMin, price } = req.body;
    const updatedService = await Service.findByIdAndUpdate(
      req.params.id,
      { name, durationMin, price },
      { new: true, runValidators: true }
    );
    if (updatedService) {
      res.json(updatedService);
    } else {
      res.status(404).end();
    }
  } catch (error) {
    res.status(400).json({ error: error });
  }
});

// Eliminar un servicio
router.delete("/:id", async (req, res) => {
  try {
    const deletedService = await Service.findByIdAndDelete(req.params.id);
    if (deletedService) {
      res.status(204).end();
    } else {
      res.status(404).end();
    }
  } catch (error) {
    res.status(400).json({ error: error });
  }
});

export default router;