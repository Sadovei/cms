import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI ?? '');
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.log(`Error : ${error.message as string}`)
        process.exit(1);
    }
}

export default connectDB;