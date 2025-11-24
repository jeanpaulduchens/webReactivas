import express from "express";
import AvailableHour from "@models/hours";

const router = express.Router();

router.get("/", async (_req, res) => {
  const hours = await AvailableHour.find({});
  res.json(hours);
});

export default router;
