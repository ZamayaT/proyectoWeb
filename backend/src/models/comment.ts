import dotenv from 'dotenv';
import mongoose, { Schema, Document, Mongoose } from 'mongoose';

dotenv.config();

const url = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DBNAME;

mongoose.set("strictQuery", false);
if (url) {
  mongoose.connect(url, { dbName }).catch((error) => {
    console.log("error connecting to MongoDB:", error.message);
  });
}

interface IComment extends Document {
  author: mongoose.Types.ObjectId,
  course: mongoose.Types.ObjectId,
  content: string,
  votes: number,
}

const commentSchema = new Schema<IComment>({
    author: { type: Schema.Types.ObjectId, ref: "User", default: null },
    course: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    content: { type: String, required: true, minlength: 1, maxLength: 300 },
    votes: { type: Number, default: 0, validate: {
        validator: function(v: number) {
            const validation: boolean = v>=0 && Number.isInteger(v);
            return validation;
        },
        message: props => `Votes value must be an Int equal or greater than 0`
    }},
  }, {
    timestamps: true,
});

const CommentModel = mongoose.model("Comment", commentSchema);

export { IComment, CommentModel };