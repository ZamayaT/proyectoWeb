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

interface IUser extends Document {
    username: string,
    password: string,
}

const userSchema = new Schema<IUser>({
        username: { type: String, required: true, unique: true },
        password: { type: String, required: true },
    }, {
        timestamps: true,
});

const UserModel =  mongoose.model("User", userSchema);

export { IUser, UserModel };