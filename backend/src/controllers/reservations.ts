import express from "express";
import Reservation from "@models/reservations";

const router = express.Router();

router.get("/", async (_req, res) => {
  const reservations = await Reservation.find({});
  res.json(reservations);
});

export default router;