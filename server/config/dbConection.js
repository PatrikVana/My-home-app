import mongoose from "mongoose";

// Připojení k MongoDB s ošetřením chyb
export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Připojeno k MongoDB!");

    } catch (error) {
        console.error("Chyba připojení k databázi:", error);
        process.exit(1);
    }
};

