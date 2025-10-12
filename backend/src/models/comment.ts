import mongoose, { Schema, Document } from 'mongoose';

interface IComment extends Document {
  author: mongoose.Types.ObjectId | null;
  course: mongoose.Types.ObjectId;
  content: string;
  votes: number;
}

const commentSchema = new Schema<IComment>({
  author: { type: Schema.Types.ObjectId, ref: "User", default: null },
  course: { type: Schema.Types.ObjectId, ref: "Course", required: true },
  content: { type: String, required: true, minlength: 1, maxLength: 300 },
  votes: { type: Number, default: 0, validate: {
    validator: function(v: number) {
      return v >= 0 && Number.isInteger(v);
    },
    message: 'Votes value must be an Int equal or greater than 0'
  }},
}, {
  timestamps: true,
});

const CommentModel = mongoose.model("Comment", commentSchema);

export { IComment, CommentModel };