import { ServiceType } from "@custom-types/types";
import mongoose from "mongoose";

interface Service {
  id: string;
  name: string;
  type: ServiceType;
  description?: string;
  durationMin: number;
  price: number;
}

const serviceSchema = new mongoose.Schema<Service>({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  durationMin: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

const Service = mongoose.model("Service", serviceSchema);

serviceSchema.set("toJSON", {
  transform: (_document, returnedObject) => {
    const { _id, __v, ...rest } = returnedObject;
    return { ...rest, id: _id.toString() };
  },
});

export default Service;
