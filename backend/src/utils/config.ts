import dotenv from "dotenv";
dotenv.config();

const HOST = process.env.HOST || "localhost";
const PORT = process.env.PORT ? Number(process.env.PORT) : 3001;
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/myapp";
const MONGODB_DBNAME = process.env.MONGODB_DBNAME || "mybarbershop";
const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";

export default { HOST, PORT, MONGODB_URI, MONGODB_DBNAME, JWT_SECRET };
