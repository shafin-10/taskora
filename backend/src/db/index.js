import mongoose from "mongoose";

const connectDb = async() => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to database succesfully");
        
    } catch (error) {
        console.eror("Failed to connect to database", error);
        process.exit(1);
    }
}

export default connectDb;