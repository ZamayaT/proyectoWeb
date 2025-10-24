import mongoose, { Schema } from 'mongoose';
import config from "../utils/config"

interface IUser extends Document {
  username: string;
  password: string;
  role: string;
}

const userSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: Object.values(config.ROLES), default: config.ROLES.USER }
}, {
  timestamps: true,
});

const UserModel = mongoose.model("User", userSchema);

userSchema.set("toJSON", {
  transform: (
    _,
    returnedObject: { id?: string; _id?: mongoose.Types.ObjectId; __v?: number }
  ) => {
    returnedObject.id = returnedObject._id?.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

export { IUser, UserModel };