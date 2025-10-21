import mongoose, { Schema} from 'mongoose';

interface ICourse extends Document {
  code: string;
  name: string;
  difficulty: number;
  required: boolean;
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

courseSchema.set("toJSON", {
  transform: (
    _,
    returnedObject: { id?: string; _id?: mongoose.Types.ObjectId; __v?: number }
  ) => {
    returnedObject.id = returnedObject._id?.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

export { ICourse, CourseModel };