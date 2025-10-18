import mongoose from "mongoose";

interface lunchBreak {
    startHour: Date;
    endHour: Date;
}

interface AvailableHourData {
    id: string;
    startHour: Date;
    endHour: Date;
    lunchBreak?: lunchBreak;
}

const availableHourDataSchema = new mongoose.Schema<AvailableHourData>({
    id: { 
        type: String, 
        required: true 
    },
    startHour: { 
        type: Date, 
        required: true 
    },
    endHour: { type: 
        Date, 
        required: true 
    },
    lunchBreak: {
        startHour: { 
            type: Date 
        },
        endHour: { 
            type: Date 
        },
    },
});

const AvailableHour = mongoose.model("AvailableHour", availableHourDataSchema);

availableHourDataSchema.set("toJSON", {
    transform: (_document, returnedObject) => {
        const { _id, __v, ...rest } = returnedObject;
        return { ...rest, id: _id.toString() };
    },
});

export default AvailableHour;

