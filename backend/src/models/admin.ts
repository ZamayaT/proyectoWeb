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

export { IAdmin, AdminModel };