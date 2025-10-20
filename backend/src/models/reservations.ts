import { ReservationStatus } from "@custom-types/types";
import mongoose from "mongoose";

export interface ReservationData {
  id: string;
  user: mongoose.Types.ObjectId;
  service: mongoose.Types.ObjectId;
  date: Date;
  time: string;
  status: ReservationStatus;
  createdAt: Date;
  updatedAt: Date;
}

const reservationSchema = new mongoose.Schema<ReservationData>({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Service",
    required: true
  },
  date: { 
    type: Date, 
    required: true 
  },
  time: {
    type: String,
    required: true
  },
  status: { 
    type: String, 
    enum: Object.values(ReservationStatus), 
    default: ReservationStatus.PENDING, 
    required: true 
  },
  timestamps: true // Agrega createdAt y updatedAt automáticamente
});

reservationSchema.set("toJSON", {
  transform: (
    _document: mongoose.Document,
    returnedObject: {
      id?: string;
      _id?: mongoose.Types.ObjectId;
      __v?: number;
    }
  ) => {
    returnedObject.id = returnedObject._id?.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Reservation = mongoose.model("Reservation", reservationSchema);

export default Reservation;
