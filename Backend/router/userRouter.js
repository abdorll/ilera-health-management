import express from "express"
import { addNewAdmin, addNewDoctor, getAllDoctors, getAllAdmins, getUserDetails, login, logoutAdmin, logoutDoctor, logoutPatient, patientRegister, editDoctor, deleteDoctor, editAdmin, deleteAdmin } from "../controller/userController.js";
import { isAdminAuthenticated, isDoctorAuthenticated, isPatientAuthenticated, isPrincipalAdmin } from "../middlewares/auth.js";

const router = express.Router();

router.post("/patient/register", patientRegister)
router.post("/login", login)

// Admin routes
router.post("/admin/addnew", isAdminAuthenticated, isPrincipalAdmin, addNewAdmin)
router.get("/admin/me", isAdminAuthenticated, getUserDetails)
router.get("/admin/logout", isAdminAuthenticated, logoutAdmin)
router.get("/admins", isAdminAuthenticated, getAllAdmins)

// Principal admin only: edit/delete admins and doctors
router.put("/admin/edit/:id", isAdminAuthenticated, isPrincipalAdmin, editAdmin)
router.delete("/admin/delete/:id", isAdminAuthenticated, isPrincipalAdmin, deleteAdmin)
router.put("/doctor/edit/:id", isAdminAuthenticated, isPrincipalAdmin, editDoctor)
router.delete("/doctor/delete/:id", isAdminAuthenticated, isPrincipalAdmin, deleteDoctor)

// Doctor routes
router.get("/doctors", getAllDoctors)
router.post("/doctor/addnew", isAdminAuthenticated, addNewDoctor)
router.get("/doctor/me", isDoctorAuthenticated, getUserDetails)
router.get("/doctor/logout", isDoctorAuthenticated, logoutDoctor)

// Patient routes
router.get("/patient/me", isPatientAuthenticated, getUserDetails)
router.get("/patient/logout", isPatientAuthenticated, logoutPatient)

export default router;
