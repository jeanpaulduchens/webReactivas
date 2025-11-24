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
    // Parsear la fecha en UTC para evitar problemas de zona horaria
    const start = new Date((date as string) + "T00:00:00.000Z");
    const end = new Date((date as string) + "T23:59:59.999Z");
    filter.date = { $gte: start, $lte: end };
  }
  if (serviceId) {
    filter.service = serviceId;
  }
  const reservations = await Reservation.find(filter);
  res.json(reservations);
});

// GET /api/reservations/confirmed-by-day?date=YYYY-MM-DD
// Endpoint específico para obtener todas las citas de un día (confirmadas y canceladas) para barberos
router.get(
  "/confirmed-by-day",
  withUser,
  requireRole("barbero"),
  async (req, res) => {
    try {
      const { date } = req.query;
      const barberId = req.userId;

      if (!date || typeof date !== "string") {
        return res
          .status(400)
          .json({ error: "Fecha requerida en formato YYYY-MM-DD" });
      }

      // Parsear la fecha en UTC para evitar problemas de zona horaria
      // Si date viene como "2025-11-23", crear Date en UTC
      const start = new Date(date + "T00:00:00.000Z");
      const end = new Date(date + "T23:59:59.999Z");

      // Buscar reservas del día asignadas a este barbero (confirmadas y canceladas)
      const reservations = await Reservation.find({
        date: { $gte: start, $lte: end },
        barber: barberId,
        status: { $in: [ReservationStatus.CONFIRMED, ReservationStatus.CANCELLED] },
      })
        .populate("user", "name email phone")
        .populate("service", "name type description price durationMin")
        .sort({ time: 1 }); // Ordenar por hora

      // Formatear respuesta para el frontend
      const formattedReservations = reservations.map((reservation: any) => ({
        id: reservation.id,
        date: reservation.date.toISOString().split("T")[0], // Convertir a formato YYYY-MM-DD
        time: reservation.time,
        status: reservation.status,
        client: {
          id: reservation.user._id,
          name: reservation.user.name,
          email: reservation.user.email,
          phone: reservation.user.phone,
        },
        service: {
          id: reservation.service._id,
          name: reservation.service.name,
          type: reservation.service.type,
          description: reservation.service.description,
          price: reservation.service.price,
          durationMin: reservation.service.durationMin,
        },
      }));

      res.json(formattedReservations);
    } catch (error) {
      console.error("Error obteniendo citas del día:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  },
);

// GET /api/reservations/my-reservations
// Endpoint para que los clientes vean sus propias reservas
router.get("/my-reservations", withUser, async (req, res) => {
  try {
    const userId = req.userId; // ID del usuario autenticado

    // Buscar todas las reservas del usuario
    const reservations = await Reservation.find({ user: userId })
      .populate("service", "name type description price durationMin")
      .sort({ date: -1, time: -1 }); // Ordenar por fecha y hora (más recientes primero)

    // Formatear respuesta para el frontend
    const formattedReservations = reservations.map((reservation: any) => ({
      id: reservation.id,
      date: reservation.date.toISOString().split("T")[0], // Convertir a formato YYYY-MM-DD
      time: reservation.time,
      status: reservation.status,
      service: {
        id: reservation.service._id,
        name: reservation.service.name,
        type: reservation.service.type,
        description: reservation.service.description,
        price: reservation.service.price,
        durationMin: reservation.service.durationMin,
      },
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
    const { serviceId, barberId, date, time, status } = req.body;
    const userId = req.userId; // ID del usuario autenticado

    if (!userId) {
      return res.status(401).json({ error: "Usuario no autenticado" });
    }

    // Buscar servicio
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(400).json({ error: "Servicio no encontrado" });
    }

    // Si se proporciona un barbero, verificar que existe y es barbero
    let barber = null;
    if (barberId) {
      barber = await User.findById(barberId);
      if (!barber) {
        return res.status(400).json({ error: "Barbero no encontrado" });
      }
      if (barber.role !== 'barbero') {
        return res.status(400).json({ error: "El usuario seleccionado no es un barbero" });
      }
    }

    // Parsear la fecha en UTC para evitar problemas de zona horaria
    // Si date viene como "2025-11-25", lo convertimos a Date en UTC
    const reservationDate = new Date(date + "T00:00:00.000Z");

    // Crear reserva con el usuario autenticado
    const newReservation = new Reservation({
      user: userId,
      service: service._id,
      barber: barber ? barber._id : undefined,
      date: reservationDate,
      time,
      status: status || "confirmed", // Cambiar default a "confirmed" para que aparezcan en la vista del barbero
    });
    const savedReservation = await newReservation.save();

    // Actualizar el array de reservations del usuario
    await User.findByIdAndUpdate(userId, {
      $push: { reservations: savedReservation._id },
    });

    res.status(201).json(savedReservation);
  } catch (error) {
    res.status(400).json({ error: error });
  }
});

// Actualizar una reserva (requiere autenticación)
// Puede ser editada por el cliente (dueño) o por el barbero asignado
router.put("/:id", withUser, async (req, res) => {
  try {
    const { id } = req.params;
    const { serviceId, date, time, status } = req.body;
    const userId = req.userId;
    const userRole = req.userRole;

    // Buscar la reserva y poblar el barbero
    const reservation = await Reservation.findById(id).populate('barber');
    if (!reservation) {
      return res.status(404).json({ error: "Reserva no encontrada" });
    }

    // Verificar permisos: el cliente puede editar su reserva, o el barbero asignado puede editar
    const isOwner = reservation.user.toString() === userId;
    const isAssignedBarber = reservation.barber && 
      typeof reservation.barber === 'object' && 
      '_id' in reservation.barber &&
      reservation.barber._id.toString() === userId;
    const isAdmin = userRole === 'admin';

    if (!isOwner && !isAssignedBarber && !isAdmin) {
      return res
        .status(403)
        .json({ error: "No tienes permiso para editar esta reserva" });
    }

    // Actualizar campos si se proporcionan
    if (serviceId) {
      const service = await Service.findById(serviceId);
      if (!service) {
        return res.status(400).json({ error: "Servicio no encontrado" });
      }
      reservation.service = service._id;
    }
    if (date) {
      // Parsear la fecha en UTC
      reservation.date = new Date(date + "T00:00:00.000Z");
    }
    if (time) reservation.time = time;
    if (status) reservation.status = status;

    const updatedReservation = await reservation.save();
    res.json(updatedReservation);
  } catch (error) {
    res.status(400).json({ error: error });
  }
});

// Cancelar una reserva (requiere autenticación)
// Puede ser cancelada por el cliente (dueño) o por el barbero asignado
// En lugar de eliminar, cambia el status a "cancelled"
router.delete("/:id", withUser, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const userRole = req.userRole;

    // Buscar la reserva y poblar el barbero
    const reservation = await Reservation.findById(id).populate('barber');
    if (!reservation) {
      return res.status(404).json({ error: "Reserva no encontrada" });
    }

    // Verificar permisos: el cliente puede cancelar su reserva, o el barbero asignado puede cancelar
    const isOwner = reservation.user.toString() === userId;
    const isAssignedBarber = reservation.barber && 
      typeof reservation.barber === 'object' && 
      '_id' in reservation.barber &&
      reservation.barber._id.toString() === userId;
    const isAdmin = userRole === 'admin';

    if (!isOwner && !isAssignedBarber && !isAdmin) {
      return res
        .status(403)
        .json({ error: "No tienes permiso para cancelar esta reserva" });
    }

    // Cambiar el status a cancelled en lugar de eliminar
    reservation.status = ReservationStatus.CANCELLED;
    await reservation.save();

    res.status(200).json({ 
      message: "Reserva cancelada exitosamente",
      reservation 
    });
  } catch (error) {
    res.status(400).json({ error: error });
  }
});

export default router;
