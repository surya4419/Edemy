import mongoose from "mongoose";

//connect to database mongo

const connectDB = async () => {
    mongoose.connection.on("connected", () => console.log("Database Connected"));

    try {
        await mongoose.connect(`${process.env.MONGODB_URI}`, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            retryWrites: true,
            w: 'majority'
        });
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
}


export default connectDB;
