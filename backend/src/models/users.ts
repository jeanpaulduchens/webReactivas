import mongoose from "mongoose";

export interface UserData {
  id: string;
  username: string;
  name: string;
  email: string;
  passwordHash: string;
  role: 'cliente' | 'barbero' | 'admin';
  phone?: string;
  reservations?: mongoose.Types.ObjectId[]; // clientes
  createdAt: Date;
}

const userSchema = new mongoose.Schema<UserData>({
  username: { 
    type: String, 
    required: true, 
    unique: true,
    minlength: 3
  },
  name: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  passwordHash: { 
    type: String, 
    required: true 
  },
  role: {
    type: String,
    enum: ['cliente', 'barbero', 'admin'],
    default: 'cliente',
    required: true
  },
  phone: {
    type: String,
    required: false
  },
  reservations: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Reservation",
    },
  ],
    }, {
    timestamps: true
});

userSchema.set("toJSON", {
  transform: (
    document,
    returnedObject: {
      id?: string;
      _id?: mongoose.Types.ObjectId;
      __v?: number;
      passwordHash?: string;
    }
  ) => {
    returnedObject.id = returnedObject._id?.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.passwordHash; // Para no exponer el hash
  },
});

const User = mongoose.model("User", userSchema);

export default User;