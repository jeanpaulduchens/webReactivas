import Service from "@models/services";
import { ServiceType } from "@custom-types/types";

const defaultServices = [
  { name: ServiceType.HAIR, durationMin: 30, price: 10 },
  { name: ServiceType.BEARDEYERBROW, durationMin: 20, price: 8 },
  { name: ServiceType.HAIRBEARD, durationMin: 40, price: 15 },
  { name: ServiceType.FULLSERVICE, durationMin: 50, price: 18 },
];

export async function seedServices() {
  for (const service of defaultServices) {
    const exists = await Service.findOne({ name: service.name });
    if (!exists) {
      await Service.create(service);
    }
  }
}
