import jwt from "jsonwebtoken";
import { User } from "../models/userSchema.js";
import { catchAsyncErrors } from "./catchAsyncErrors.js"
import ErrorHandler from "./errorMiddleware.js";

export const isAdminAuthenticated = catchAsyncErrors(async (req, res, next) => {
    const token = req.cookies.adminToken;
    if (!token) {
        return next(new ErrorHandler("Admin not authenticated!", 400))
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = await User.findById(decoded.id)
    if (req.user.role !== "Admin") {
        return next(new ErrorHandler(`${req.user.role} not authorized for this resource!`, 403))
    }
    next()
})


export const isPatientAuthenticated = catchAsyncErrors(async (req, res, next) => {
    const token = req.cookies.patientToken;
    if (!token) {
        return next(new ErrorHandler("Please log in to continue!", 400))
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = await User.findById(decoded.id)
    if (req.user.role !== "Patient") {
        return next(new ErrorHandler(`${req.user.role} not authorized for this resource!`, 403))
    }
    next()
})


export const isDoctorAuthenticated = catchAsyncErrors(async (req, res, next) => {
    const token = req.cookies.doctorToken;
    if (!token) {
        return next(new ErrorHandler("Doctor not authenticated!", 400))
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = await User.findById(decoded.id)
    if (req.user.role !== "Doctor") {
        return next(new ErrorHandler(`${req.user.role} not authorized for this resource!`, 403))
    }
    next()
})


// Principal admin check — must be called AFTER isAdminAuthenticated
const PRINCIPAL_ADMIN_EMAIL = "admin@ilera.com";

export const isPrincipalAdmin = catchAsyncErrors(async (req, res, next) => {
    if (req.user.email !== PRINCIPAL_ADMIN_EMAIL) {
        return next(new ErrorHandler("Only the principal admin can perform this action!", 403))
    }
    next()
})