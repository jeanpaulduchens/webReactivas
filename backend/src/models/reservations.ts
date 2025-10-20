import { ReservationStatus } from "@custom-types/types";
import mongoose from "mongoose";

interface Reservation {
  id: string;
  serviceId: number;
  customerName: string;
  date: Date;
  status: ReservationStatus;
}

const reservationSchema = new mongoose.Schema<Reservation>({
  id: { type: String, required: true },
  serviceId: { type: Number, required: true },
  customerName: { type: String, required: true },
  date: { type: Date, required: true },
  status: { type: String, enum: Object.values(ReservationStatus), required: true },
});
const Reservation = mongoose.model("Reservation", reservationSchema);

reservationSchema.set("toJSON", {
  transform: (_document, returnedObject) => {
    const { _id, __v, ...rest } = returnedObject;
    return { ...rest, id: _id.toString() };
  },
});

export default Reservation;
