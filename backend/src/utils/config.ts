import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT;
const HOST = process.env.HOST || "localhost";

const MONGODB_URI =
    process.env.NODE_ENV === "test"
    ? process.env.TEST_MONGODB_URI
    : process.env.MONGODB_URI || "mongodb://localhost:27017";

const JWT_SECRET = process.env.JWT_SECRET || "my_secret";
const MONGODB_DBNAME =
    process.env.NODE_ENV === "test" 
    ? process.env.TEST_MONGODB_DBNAME 
    : process.env.MONGODB_DBNAME || "proyectodb"

const ADMIN_USER = process.env.ADMIN_USER || "admin"
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123"
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@example.com"

const ROLES = {
  ADMIN: 'admin',
  USER: 'user'
}


export default { PORT, HOST, MONGODB_URI, JWT_SECRET, MONGODB_DBNAME, ADMIN_USER, ADMIN_PASSWORD, ADMIN_EMAIL, ROLES}