import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
    patientId: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true
    },
    patientFirstName: {
        type: String,
        required: true
    },
    patientLastName: {
        type: String,
        required: true
    },
    patientEmail: {
        type: String,
        required: true
    },
    patientPhone: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: [true, "Please select a department!"]
    },
    condition: {
        type: String,
        required: [true, "Please describe your condition!"],
        minLength: [5, "Condition description must contain at least 5 characters!"]
    },
    appointment_date: {
        type: String,
        required: [true, "Please select an appointment date!"]
    },
    address: {
        type: String,
        required: [true, "Please provide your address!"]
    },
    doctor: {
        firstName: {
            type: String,
            default: null
        },
        lastName: {
            type: String,
            default: null
        }
    },
    doctorId: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        default: null
    },
    hasVisited: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ["Pending", "Assigned", "Accepted", "Rejected", "Completed"],
        default: "Pending"
    }
}, { timestamps: true })

export const Appointment = mongoose.model("Appointment", appointmentSchema);
