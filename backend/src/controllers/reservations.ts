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

// GET /api/reservations/my-reservations
// Endpoint para que los clientes vean sus propias reservas
router.get("/my-reservations", withUser, async (req, res) => {
  try {
    const userId = req.userId; // ID del usuario autenticado

    // Buscar todas las reservas del usuario
    const reservations = await Reservation.find({ user: userId })
      .populate('service', 'name type description price durationMin')
      .sort({ date: -1, time: -1 }); // Ordenar por fecha y hora (más recientes primero)

    // Formatear respuesta para el frontend
    const formattedReservations = reservations.map((reservation: any) => ({
      id: reservation.id,
      date: reservation.date,
      time: reservation.time,
      status: reservation.status,
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
    console.error("Error obteniendo mis reservas:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});


// Crear una nueva reserva (requiere autenticación)
router.post("/", withUser, async (req, res) => {
  try {
    const { serviceId, date, time, status } = req.body;
    const userId = req.userId; // ID del usuario autenticado

    if (!userId) {
      return res.status(401).json({ error: "Usuario no autenticado" });
    }

    // Buscar servicio
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(400).json({ error: "Servicio no encontrado" });
    }

    // Crear reserva con el usuario autenticado
    const newReservation = new Reservation({
      user: userId,
      service: service._id,
      date,
      time,
      status: status || "pending"
    });
    const savedReservation = await newReservation.save();
    
    // Actualizar el array de reservations del usuario
    await User.findByIdAndUpdate(userId, {
      $push: { reservations: savedReservation._id }
    });
    
    res.status(201).json(savedReservation);
  } catch (error) {
    res.status(400).json({ error: error });
  }
});

// Actualizar una reserva (requiere autenticación)
router.put("/:id", withUser, async (req, res) => {
  try {
    const { id } = req.params;
    const { serviceId, date, time, status } = req.body;
    const userId = req.userId;

    // Buscar la reserva
    const reservation = await Reservation.findById(id);
    if (!reservation) {
      return res.status(404).json({ error: "Reserva no encontrada" });
    }

    // Verificar que el usuario es el dueño de la reserva
    if (reservation.user.toString() !== userId) {
      return res.status(403).json({ error: "No tienes permiso para editar esta reserva" });
    }

    // Actualizar campos si se proporcionan
    if (serviceId) {
      const service = await Service.findById(serviceId);
      if (!service) {
        return res.status(400).json({ error: "Servicio no encontrado" });
      }
      reservation.service = service._id;
    }
    if (date) reservation.date = date;
    if (time) reservation.time = time;
    if (status) reservation.status = status;

    const updatedReservation = await reservation.save();
    res.json(updatedReservation);
  } catch (error) {
    res.status(400).json({ error: error });
  }
});

// Eliminar una reserva (requiere autenticación)
router.delete("/:id", withUser, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    // Buscar la reserva
    const reservation = await Reservation.findById(id);
    if (!reservation) {
      return res.status(404).json({ error: "Reserva no encontrada" });
    }

    // Verificar que el usuario es el dueño de la reserva
    if (reservation.user.toString() !== userId) {
      return res.status(403).json({ error: "No tienes permiso para eliminar esta reserva" });
    }

    await Reservation.findByIdAndDelete(id);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error });
  }
});

export default router;