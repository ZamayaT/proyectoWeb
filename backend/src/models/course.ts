import dotenv from 'dotenv';
import mongoose, { Schema, Document } from 'mongoose';

dotenv.config();

const url = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DBNAME;

mongoose.set("strictQuery", false);
if (url) {
  mongoose.connect(url, { dbName }).catch((error) => {
    console.log("error connecting to MongoDB:", error.message);
  });
}

interface ICourse extends Document {
  code: string,
  name: string,
  difficulty: number,
  required: boolean,
}

const courseSchema = new Schema<ICourse>({
    code: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    difficulty: { type: Number, required: true },
    required: { type: Boolean, required: true }
  }, {
    timestamps: true,
});

const CourseModel = mongoose.model("Course", courseSchema);

export { ICourse, CourseModel };