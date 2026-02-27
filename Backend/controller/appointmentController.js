import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js"
import ErrorHandler from "../middlewares/errorMiddleware.js"
import { Appointment } from "../models/appointmentSchema.js"
import { User } from "../models/userSchema.js"

export const postAppointment = catchAsyncErrors(async (req, res, next) => {
    const {
        department,
        condition,
        appointment_date,
        address,
        hasVisited
    } = req.body

    if (!department || !condition || !appointment_date || !address) {
        return next(new ErrorHandler("Please fill all fields!", 400))
    }

    const patient = req.user;

    const appointment = await Appointment.create({
        patientId: patient._id,
        patientFirstName: patient.firstName,
        patientLastName: patient.lastName,
        patientEmail: patient.email,
        patientPhone: patient.phone,
        department,
        condition,
        appointment_date,
        address,
        hasVisited: Boolean(hasVisited)
        // status defaults to "Pending", no doctor assigned
    })

    res.status(200).json({
        success: true,
        message: "Appointment booked successfully!",
        appointment
    })
})


export const getMyAppointments = catchAsyncErrors(async (req, res, next) => {
    const appointments = await Appointment.find({ patientId: req.user._id })
        .populate("doctorId", "firstName lastName email phone doctrDptmnt doctrAvatar gender")
        .sort({ createdAt: -1 });
    res.status(200).json({
        success: true,
        appointments
    })
})


export const getAllAppointments = catchAsyncErrors(async (req, res, next) => {
    const appointments = await Appointment.find()
        .populate("doctorId", "firstName lastName email phone doctrDptmnt doctrAvatar gender")
        .sort({ createdAt: -1 });
    res.status(200).json({
        success: true,
        appointments
    })
})


// Admin assigns a doctor -> status becomes "Assigned"
export const assignDoctor = catchAsyncErrors(async (req, res, next) => {
    const { appointmentId, doctorId } = req.body;

    if (!appointmentId || !doctorId) {
        return next(new ErrorHandler("Please provide appointment ID and doctor ID!", 400));
    }

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
        return next(new ErrorHandler("Appointment not found!", 404));
    }

    const doctor = await User.findById(doctorId);
    if (!doctor || doctor.role !== "Doctor") {
        return next(new ErrorHandler("Doctor not found!", 404));
    }

    if (doctor.doctrDptmnt !== appointment.department) {
        return next(new ErrorHandler("This doctor is not in the same department as the appointment!", 400));
    }

    appointment.doctorId = doctor._id;
    appointment.doctor = {
        firstName: doctor.firstName,
        lastName: doctor.lastName
    };
    appointment.status = "Assigned";
    await appointment.save();

    res.status(200).json({
        success: true,
        message: `Dr. ${doctor.firstName} ${doctor.lastName} has been assigned. Awaiting doctor's response.`,
        appointment
    })
})


export const getDoctorsByDepartment = catchAsyncErrors(async (req, res, next) => {
    const { department } = req.params;
    const doctors = await User.find({ role: "Doctor", doctrDptmnt: department });
    res.status(200).json({
        success: true,
        doctors
    })
})


// Doctor-specific endpoints
export const getDoctorAssignedAppointments = catchAsyncErrors(async (req, res, next) => {
    const appointments = await Appointment.find({ doctorId: req.user._id })
        .sort({ createdAt: -1 });
    res.status(200).json({
        success: true,
        appointments
    })
})


export const getDoctorDeptUnassigned = catchAsyncErrors(async (req, res, next) => {
    const doctor = req.user;
    const appointments = await Appointment.find({
        department: doctor.doctrDptmnt,
        doctorId: null
    }).sort({ createdAt: -1 });
    res.status(200).json({
        success: true,
        appointments
    })
})


// Doctor self-assigns -> status becomes "Accepted" directly
export const doctorSelfAssign = catchAsyncErrors(async (req, res, next) => {
    const { appointmentId } = req.body;
    const doctor = req.user;

    if (!appointmentId) {
        return next(new ErrorHandler("Please provide appointment ID!", 400));
    }

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
        return next(new ErrorHandler("Appointment not found!", 404));
    }

    if (appointment.doctorId) {
        return next(new ErrorHandler("This appointment is already assigned to a doctor!", 400));
    }

    if (appointment.department !== doctor.doctrDptmnt) {
        return next(new ErrorHandler("You can only assign yourself to appointments in your department!", 400));
    }

    appointment.doctorId = doctor._id;
    appointment.doctor = {
        firstName: doctor.firstName,
        lastName: doctor.lastName
    };
    appointment.status = "Accepted";
    await appointment.save();

    res.status(200).json({
        success: true,
        message: `You have been assigned to ${appointment.patientFirstName} ${appointment.patientLastName}'s appointment.`,
        appointment
    })
})


// Doctor responds to admin assignment (accept/reject)
export const doctorRespondToAssignment = catchAsyncErrors(async (req, res, next) => {
    const { appointmentId, response } = req.body;

    if (!appointmentId || !response) {
        return next(new ErrorHandler("Please provide appointment ID and response!", 400));
    }

    if (!["Accepted", "Rejected"].includes(response)) {
        return next(new ErrorHandler("Response must be 'Accepted' or 'Rejected'!", 400));
    }

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
        return next(new ErrorHandler("Appointment not found!", 404));
    }

    if (String(appointment.doctorId) !== String(req.user._id)) {
        return next(new ErrorHandler("You are not assigned to this appointment!", 403));
    }

    if (appointment.status !== "Assigned") {
        return next(new ErrorHandler("This appointment is not awaiting your response!", 400));
    }

    appointment.status = response;

    // If rejected, keep status as "Rejected" and keep doctor info
    // so admin can see who declined and reassign to another doctor

    await appointment.save();

    const msg = response === "Accepted"
        ? `You have accepted ${appointment.patientFirstName}'s appointment.`
        : `You have declined. The appointment will be reassigned.`;

    res.status(200).json({
        success: true,
        message: msg,
        appointment
    })
})


// Doctor marks an appointment as completed
export const doctorMarkCompleted = catchAsyncErrors(async (req, res, next) => {
    const { appointmentId } = req.body;

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
        return next(new ErrorHandler("Appointment not found!", 404));
    }

    if (String(appointment.doctorId) !== String(req.user._id)) {
        return next(new ErrorHandler("You are not assigned to this appointment!", 403));
    }

    if (appointment.status !== "Accepted") {
        return next(new ErrorHandler("Only accepted appointments can be marked as completed!", 400));
    }

    appointment.status = "Completed";
    appointment.hasVisited = true;
    await appointment.save();

    res.status(200).json({
        success: true,
        message: "Appointment marked as completed!",
        appointment
    })
})


export const updateAppointmentStatus = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;

    let appointment = await Appointment.findById(id)
    if (!appointment) {
        return next(new ErrorHandler("Appointment not found!", 404))
    }
    appointment = await Appointment.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })
    res.status(200).json({
        success: true,
        message: "Appointment Status Updated!",
        appointment
    })
})


export const deleteAppointment = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;
    let appointment = await Appointment.findById(id)
    if (!appointment) {
        return next(new ErrorHandler("Appointment not found!", 404))
    }

    await appointment.deleteOne();
    res.status(200).json({
        success: true,
        message: "Appointment Deleted!",
    })
})