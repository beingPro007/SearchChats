import mongoose from "mongoose";

const dbConnect = async() => {
    try {
        const mongoDBconnection = await mongoose.connect(
          `${process.env.MONGODB_URI}/${process.env.DB_NAME}`
        );
        console.log(
          `Mongo DB connected Succesfully with DB Host : ${mongoDBconnection.connection.host}`
        );
    } catch (error) {
        console.log(error);
        process.exit(1);        
    }
    
}

export default dbConnect;