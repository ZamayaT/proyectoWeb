import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT;
const HOST = process.env.HOST || "localhost";

const MONGODB_URI =
    process.env.NODE_ENV === "test"
    ? process.env.TEST_MONGODB_URI
    : process.env.MONGODB_URI;

const JWT_SECRET = process.env.JWT_SECRET || "my_secret";
const MONGODB_DBNAME =
    process.env.NODE_ENV === "test" 
    ? process.env.TEST_MONGODB_DBNAME 
    : process.env.MONGODB_DBNAME || "proejectdb"

export default { PORT, HOST, MONGODB_URI, JWT_SECRET, MONGODB_DBNAME}