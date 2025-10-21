import express from "express";
import Reservation from "@models/reservations";
import User from "@models/users";
import Service from "@models/services";
import { withUser, requireRole } from "@utils/middleware";
import { ReservationStatus } from "@custom-types/types";

const router = express.Router();

// GET /api/reservations?date=YYYY-MM-DD&serviceId=...
router.get("/", async (req, res) => {
  const { date, serviceId } = req.query;
  let filter: any = {};
  if (date) {
    // Buscar reservas en ese día (ignorando la hora)
    const start = new Date(date as string);
    const end = new Date(date as string);
    end.setHours(23, 59, 59, 999);
    filter.date = { $gte: start, $lte: end };
  }
  if (serviceId) {
    filter.service = serviceId;
  }
  const reservations = await Reservation.find(filter);
  res.json(reservations);
});

// GET /api/reservations/confirmed-by-day?date=YYYY-MM-DD
// Endpoint específico para obtener todas las citas confirmadas de un día (para barberos)
router.get("/confirmed-by-day", withUser, requireRole('barbero'), async (req, res) => {
  try {
    const { date } = req.query;

    if (!date || typeof date !== 'string') {
      return res.status(400).json({ error: "Fecha requerida en formato YYYY-MM-DD" });
    }

    // Buscar reservas confirmadas en ese día
    const start = new Date(date as string);
    const end = new Date(date as string);
    end.setHours(23, 59, 59, 999);

    const reservations = await Reservation.find({
      date: { $gte: start, $lte: end },
      status: ReservationStatus.CONFIRMED
    })
    .populate('user', 'name email phone')
    .populate('service', 'name type description price durationMin')
    .sort({ time: 1 }); // Ordenar por hora

    // Formatear respuesta para el frontend
    const formattedReservations = reservations.map((reservation: any) => ({
      id: reservation.id,
      date: reservation.date,
      time: reservation.time,
      status: reservation.status,
      client: {
        id: reservation.user._id,
        name: reservation.user.name,
        email: reservation.user.email,
        phone: reservation.user.phone
      },
      service: {
        id: reservation.service._id,
        name: reservation.service.name,
        type: reservation.service.type,
        description: reservation.service.description,
        price: reservation.service.price,
        durationMin: reservation.service.durationMin
      }
    }));

    res.json(formattedReservations);
  } catch (error) {
    console.error("Error obteniendo citas confirmadas:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Crear una nueva reserva
router.post("/", async (req, res) => {
  try {
    const { fullName, email, phone, barber, serviceId, date, time, status } = req.body;

    // Buscar o crear usuario
    let user = await User.findOne({ email });
    if (!user) {
      user = new User({ name: fullName, email, phone });
      await user.save();
    }

    // Buscar servicio
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(400).json({ error: "Servicio no encontrado" });
    }

    // Crear reserva
    const newReservation = new Reservation({
      user: user._id,
      service: service._id,
      date,
      time,
      status: status || "pending",
      barber
    });
    const savedReservation = await newReservation.save();
    res.status(201).json(savedReservation);
  } catch (error) {
    res.status(400).json({ error: error });
  }
});

export default router;