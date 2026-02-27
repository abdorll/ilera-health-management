import { config } from "dotenv";
import mongoose from "mongoose";
import { User } from "./models/userSchema.js";

config({ path: "./config/config.env" });

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            dbName: "Ilera_Hospital",
        });
        console.log("Connected to Database");

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: "admin@ilera.com" });
        if (existingAdmin) {
            console.log("Admin user already exists! You can login with:");
            console.log("  Email: admin@ilera.com");
            console.log("  Password: admin1234");
            process.exit(0);
        }

        // Create default admin
        await User.create({
            firstName: "Admin",
            lastName: "Ilera",
            email: "admin@ilera.com",
            phone: "09076106639",
            password: "admin1234",
            gender: "Male",
            nin: "12345678901",
            dob: "1990-01-01",
            role: "Admin",
        });

        console.log("✅ Default admin created successfully!");
        console.log("  Email: admin@ilera.com");
        console.log("  Password: admin1234");
        process.exit(0);
    } catch (error) {
        console.error("Error seeding admin:", error.message);
        process.exit(1);
    }
};

seedAdmin();
