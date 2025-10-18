import mongoose from "mongoose";

interface ServiceData {
    id: string;
    name: string;
    durationMin: number;
    price: number;
}

const serviceSchema = new mongoose.Schema<ServiceData>({
    name: { 
        type: String,
        required: true 
    },
    durationMin: { 
        type: Number,
        required: true 
    },
    price: { 
        type: Number,
        required: true
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