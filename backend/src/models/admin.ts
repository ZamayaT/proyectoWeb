import dotenv from 'dotenv';
import mongoose, { Schema } from 'mongoose';

dotenv.config();

mongoose.set("strictQuery", false);

interface IAdmin extends Document {
    username: string,
    password: string,
}

const adminSchema = new Schema<IAdmin>({
        username: { type: String, required: true, unique: true },
        password: { type: String, required: true },
    }, {
        timestamps: true,
});

const AdminModel =  mongoose.model("Admin", adminSchema);

adminSchema.set("toJSON", {
  transform: (
    _,
    returnedObject: { id?: string; _id?: mongoose.Types.ObjectId; __v?: number }
  ) => {
    returnedObject.id = returnedObject._id?.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

export { IAdmin, AdminModel };