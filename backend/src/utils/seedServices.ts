import Service from "@models/services";
import { ServiceType } from "@custom-types/types";

const defaultServices = [
  {
    name: "Corte de cabello",
    type: ServiceType.HAIR,
    description: "Corte de cabello",
    durationMin: 30,
    price: 10,
  },
  {
    name: "Corte de barba y perfilado",
    type: ServiceType.BEARDEYERBROW,
    description: "Corte de barba y cejas",
    durationMin: 20,
    price: 8,
  },
  {
    name: "Corte de cabello y barba",
    type: ServiceType.HAIRBEARD,
    description: "Corte de cabello y barba",
    durationMin: 40,
    price: 15,
  },
  {
    name: "Servicio completo",
    type: ServiceType.FULLSERVICE,
    description: "Servicio completo",
    durationMin: 50,
    price: 18,
  },
];

export async function seedServices() {
  try {
    console.log("Starting to seed default services...");
    
    for (const service of defaultServices) {
      const exists = await Service.findOne({ name: service.name });
      if (!exists) {
        await Service.create(service);
        console.log(`Created service: ${service.name}`);
      } else {
        console.log(`Service already exists: ${service.name}`);
      }
    }
    
    console.log("Finished seeding services successfully");
  } catch (error) {
    console.error("Error seeding services:", error);
    throw error;
  }
}
