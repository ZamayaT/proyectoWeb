import mongoose from "mongoose";
import dotenv from "dotenv";
import {CourseModel} from "../src/models/course"; // ajustá según tu estructura
import {UserModel} from "../src/models/user";
import {CommentModel} from "../src/models/comment";
import ramos from "./ramos";
import bcrypt from "bcrypt"
import config from "../src/utils/config"

dotenv.config();

const MONGODB_URI = config.MONGODB_URI || "mongodb://localhost:27017";

const seed = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {dbName : config.MONGODB_DBNAME} );
    console.log("✅ Conectado a MongoDB");

    // Limpia colecciones antiguas
    await CourseModel.deleteMany({});
    await UserModel.deleteMany({});
    await CommentModel.deleteMany({});

    // Inserta datos iniciales
    const courses = await CourseModel.insertMany(ramos);

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(config.ADMIN_PASSWORD, saltRounds);

    const admin = new UserModel({
        username: config.ADMIN_USER,
        role: config.ROLES.ADMIN,
        password: passwordHash,
    });

    await admin.save();

    console.log("✅ Datos insertados:", courses.length, "cursos, 1 usuario root");
    mongoose.connection.close();
  } catch (err) {
    console.error("❌ Error al ejecutar seed:", err);
    process.exit(1);
  }
};

seed();