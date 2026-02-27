import express from "express"
import { deleteAppointment, getAllAppointments, getMyAppointments, postAppointment, updateAppointmentStatus, assignDoctor, getDoctorsByDepartment, getDoctorAssignedAppointments, getDoctorDeptUnassigned, doctorSelfAssign, doctorRespondToAssignment, doctorMarkCompleted } from "../controller/appointmentController.js";
import { isAdminAuthenticated, isDoctorAuthenticated, isPatientAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

// Patient routes
router.post("/post", isPatientAuthenticated, postAppointment)
router.get("/myappointments", isPatientAuthenticated, getMyAppointments)

// Admin routes
router.get("/getall", isAdminAuthenticated, getAllAppointments)
router.put("/update/:id", isAdminAuthenticated, updateAppointmentStatus)
router.put("/assign", isAdminAuthenticated, assignDoctor)
router.get("/doctors/:department", isAdminAuthenticated, getDoctorsByDepartment)
router.delete("/delete/:id", isAdminAuthenticated, deleteAppointment)

// Doctor routes
router.get("/doctor/mypatients", isDoctorAuthenticated, getDoctorAssignedAppointments)
router.get("/doctor/unassigned", isDoctorAuthenticated, getDoctorDeptUnassigned)
router.put("/doctor/selfassign", isDoctorAuthenticated, doctorSelfAssign)
router.put("/doctor/respond", isDoctorAuthenticated, doctorRespondToAssignment)
router.put("/doctor/complete", isDoctorAuthenticated, doctorMarkCompleted)

export default router;
