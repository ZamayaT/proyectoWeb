import mongoose, { Schema } from 'mongoose';
import { CourseModel } from './course';

interface IComment extends Document {
  author: mongoose.Types.ObjectId | null;
  course: mongoose.Types.ObjectId;
  content: string;
  votes: number;
  isAnonimo : boolean;
}

const commentSchema = new Schema<IComment>({
  author: { type: Schema.Types.ObjectId, ref: "User", default: null },
  course: { type: Schema.Types.ObjectId, ref: "Course", required: true },
  isAnonimo: { type: Boolean},
  content: { type: String,  maxLength: 1000 },
  votes: { type: Number, min: 1, max: 7, required: true, validate: {
    validator: function(v: number) {
      return v >= 0 && Number.isInteger(v);
    },
    message: 'Votes value must be an Int equal or greater than 0'
  }},
}, {
  timestamps: true,
});

//  Hook para actualizar promedio al guardar
commentSchema.post("save", async function (doc) {
  const {course, votes } = doc
  const courseData = await CourseModel.findById(course);

  if (!courseData) return;
  const { id, difficulty, totalComments} = courseData;

  // Nuevo promedio con fórmula incremental
  const newTotal = totalComments + 1;
  const newDificulty = ((difficulty * totalComments) + votes) / (newTotal);

  await CourseModel.findByIdAndUpdate(id, {
    difficulty: newDificulty,
    totalComments: newTotal,
  });
});

//  Hook para actualizar promedio al eliminar
commentSchema.post("findOneAndDelete", async function (doc) {
  const {course, votes } = doc
  const courseData = await CourseModel.findById(course);

  if (!courseData) return;
  const { id, difficulty, totalComments} = courseData;

  // Nuevo promedio con fórmula incremental
  const newTotal = (totalComments - 1 > 0) ? totalComments - 1 : 0;
  if (newTotal === 0) {
    await CourseModel.findByIdAndUpdate(id, {
      difficulty: 0,
      totalComments: 0,
    });
    return;
  }
  else { 
    const newDificulty = ((difficulty * totalComments) - votes) / (newTotal);
    await CourseModel.findByIdAndUpdate(id, {
      difficulty: newDificulty,
      totalComments: newTotal,
    });
  }
});


const CommentModel = mongoose.model("Comment", commentSchema);

commentSchema.set("toJSON", {
  transform: (
    _,
    returnedObject: { id?: string; _id?: mongoose.Types.ObjectId; __v?: number }
  ) => {
    returnedObject.id = returnedObject._id?.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

export { IComment, CommentModel };