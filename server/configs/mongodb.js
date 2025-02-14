import mongoose from "mongoose";

//connect to database mongo

const connectDB = async () => {
    mongoose.connection.on("connected", ()=> console.log("Database Connected"))

    await mongoose.connect(`${process.env.MONGODB_URI}/Edemy`)
}

export default connectDB;