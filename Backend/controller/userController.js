import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import { User } from "../models/userSchema.js";
import { generateToken } from "../utils/jwtToken.js";
import cloudinary from "cloudinary";
import { sendDoctorWelcomeEmail, sendAdminWelcomeEmail, sendEmailChangeNotification } from "../utils/sendEmail.js";

export const patientRegister = catchAsyncErrors(async (req, res, next) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    password,
    gender,
    nin,
    dob,
    role,
  } = req.body;
  if (
    !firstName ||
    !lastName ||
    !email ||
    !phone ||
    !password ||
    !gender ||
    !nin ||
    !dob ||
    !role
  ) {
    return next(new ErrorHandler("Please Fill Full Form!", 400));
  }

  let user = await User.findOne({ email });
  if (user) {
    return next(new ErrorHandler("User already registered with this email!", 400));
  }

  user = await User.create({
    firstName,
    lastName,
    email,
    phone,
    password,
    gender,
    dob,
    nin,
    role,
  });
  generateToken(user, "User Registered", 200, res);
});

export const login = catchAsyncErrors(async (req, res, next) => {
  const { email, password, confirmPassword, role } = req.body;
  if (!email || !password || !confirmPassword || !role) {
    return next(new ErrorHandler("Please provide all details!", 400));
  }
  if (password !== confirmPassword) {
    return next(
      new ErrorHandler("Password and Confirm Password Do not Match!", 400)
    );
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid Password or Email!", 400));
  }

  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid Password or Email!", 400));
  }

  if (role !== user.role) {
    return next(new ErrorHandler("User with this role not found!", 400));
  }
  generateToken(user, "User Login Successfully", 200, res);
});

export const addNewAdmin = catchAsyncErrors(async (req, res, next) => {
  const { firstName, lastName, email, phone, password, gender, nin, dob } =
    req.body;
  if (
    !firstName ||
    !lastName ||
    !email ||
    !phone ||
    !password ||
    !gender ||
    !nin ||
    !dob
  ) {
    return next(new ErrorHandler("Please Fill Full Form!", 400));
  }

  const isRegisterd = await User.findOne({ email });
  if (isRegisterd) {
    return next(
      new ErrorHandler(
        `${isRegisterd.role} with this email already exists!`,
        400
      )
    );
  }

  // Send welcome email FIRST — only create admin if email succeeds
  try {
    await sendAdminWelcomeEmail({
      firstName,
      lastName,
      email,
      password
    });
    console.log(`✅ Admin welcome email sent to ${email}`);
  } catch (emailError) {
    console.error(`⚠️ Failed to send admin welcome email to ${email}:`, emailError.message);
    return next(new ErrorHandler("Failed to send invitation email. Admin was not created. Please check your network and try again.", 500));
  }

  const admin = await User.create({
    firstName,
    lastName,
    email,
    phone,
    password,
    gender,
    nin,
    dob,
    role: "Admin",
  });

  res.status(200).json({
    success: true,
    message: "New Admin Registered! An invitation email has been sent to their inbox.",
  });
});

export const getAllDoctors = catchAsyncErrors(async (req, res, next) => {
  const doctors = await User.find({ role: "Doctor" });
  res.status(200).json({
    success: true,
    doctors,
  });
});

export const getUserDetails = catchAsyncErrors(async (req, res, next) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    user,
  });
});

export const logoutAdmin = catchAsyncErrors(async (req, res, next) => {
  res
    .status(200)
    .cookie("adminToken", "", {
      httpOnly: true,
      expires: new Date(Date.now()),
    })
    .json({
      success: true,
      message: "Admin Logged Out Successfully!",
    });
});

export const logoutPatient = catchAsyncErrors(async (req, res, next) => {
  res
    .status(200)
    .cookie("patientToken", "", {
      httpOnly: true,
      expires: new Date(Date.now()),
    })
    .json({
      success: true,
      message: "Patient Logged Out Successfully!",
    });
});

export const logoutDoctor = catchAsyncErrors(async (req, res, next) => {
  res
    .status(200)
    .cookie("doctorToken", "", {
      httpOnly: true,
      expires: new Date(Date.now()),
    })
    .json({
      success: true,
      message: "Doctor Logged Out Successfully!",
    });
});

export const addNewDoctor = catchAsyncErrors(async (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new ErrorHandler("Doctor avatar required!", 400));
  }
  const { doctrAvatar } = req.files;

  const allowedFormats = ["image/png", "image/jpeg", "image/webp"];
  if (!allowedFormats.includes(doctrAvatar.mimetype)) {
    return next(new ErrorHandler("File format not supported!", 400));
  }

  const {
    firstName,
    lastName,
    email,
    phone,
    password,
    gender,
    nin,
    dob,
    doctrDptmnt,
  } = req.body;
  if (
    !firstName ||
    !lastName ||
    !email ||
    !phone ||
    !password ||
    !gender ||
    !nin ||
    !dob ||
    !doctrDptmnt
  ) {
    return next(new ErrorHandler("Please provide full details", 400));
  }

  const isRegistered = await User.findOne({ email });
  if (isRegistered) {
    return next(
      new ErrorHandler(
        `${isRegistered.role} already registered with this email!`,
        400
      )
    );
  }

  // Send welcome email FIRST — only create doctor if email succeeds
  try {
    await sendDoctorWelcomeEmail({
      firstName,
      lastName,
      email,
      password,
      department: doctrDptmnt
    });
    console.log(`✅ Welcome email sent to ${email}`);
  } catch (emailError) {
    console.error(`⚠️ Failed to send welcome email to ${email}:`, emailError.message);
    return next(new ErrorHandler("Failed to send welcome email. Doctor was not created. Please check your network and try again.", 500));
  }

  const cloudinaryResponse = await cloudinary.uploader.upload(
    doctrAvatar.tempFilePath
  );
  if (!cloudinaryResponse || cloudinaryResponse.error) {
    console.error(
      "Cloudinary Error:",
      cloudinaryResponse.error || "Unknown Cloudinary Error"
    );
  }

  const doctor = await User.create({
    firstName,
    lastName,
    email,
    phone,
    password,
    gender,
    nin,
    dob,
    role: "Doctor",
    doctrDptmnt,
    doctrAvatar: {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    },
  });

  res.status(200).json({
    success: true,
    message: "New Doctor Registered! A welcome email has been sent to their inbox.",
    doctor,
  });
});


// Get all admins
export const getAllAdmins = catchAsyncErrors(async (req, res, next) => {
  const admins = await User.find({ role: "Admin" });
  res.status(200).json({
    success: true,
    admins,
  });
});


// Edit a doctor profile (principal admin only)
export const editDoctor = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  let doctor = await User.findById(id);
  if (!doctor) {
    return next(new ErrorHandler("Doctor not found!", 404));
  }
  if (doctor.role !== "Doctor") {
    return next(new ErrorHandler("This user is not a doctor!", 400));
  }

  const oldEmail = doctor.email;
  const updatedData = {};
  const fields = ["firstName", "lastName", "email", "phone", "nin", "dob", "gender", "doctrDptmnt"];
  fields.forEach((field) => {
    if (req.body[field]) updatedData[field] = req.body[field];
  });

  // If email is changing, send notification to both old and new
  if (updatedData.email && updatedData.email !== oldEmail) {
    try {
      await sendEmailChangeNotification({
        firstName: updatedData.firstName || doctor.firstName,
        lastName: updatedData.lastName || doctor.lastName,
        oldEmail,
        newEmail: updatedData.email,
        role: "Doctor"
      });
      console.log(`✅ Email change notification sent for doctor ${oldEmail} → ${updatedData.email}`);
    } catch (emailError) {
      console.error(`⚠️ Failed to send email change notification:`, emailError.message);
    }
  }

  doctor = await User.findByIdAndUpdate(id, updatedData, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    message: "Doctor profile updated!",
    doctor,
  });
});


// Delete a doctor (principal admin only)
export const deleteDoctor = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const doctor = await User.findById(id);
  if (!doctor) {
    return next(new ErrorHandler("Doctor not found!", 404));
  }
  if (doctor.role !== "Doctor") {
    return next(new ErrorHandler("This user is not a doctor!", 400));
  }

  // Remove cloudinary avatar if exists
  if (doctor.doctrAvatar && doctor.doctrAvatar.public_id) {
    await cloudinary.uploader.destroy(doctor.doctrAvatar.public_id);
  }

  await doctor.deleteOne();
  res.status(200).json({
    success: true,
    message: "Doctor removed successfully!",
  });
});


// Edit an admin profile (principal admin only)
export const editAdmin = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  let admin = await User.findById(id);
  if (!admin) {
    return next(new ErrorHandler("Admin not found!", 404));
  }
  if (admin.role !== "Admin") {
    return next(new ErrorHandler("This user is not an admin!", 400));
  }

  const oldEmail = admin.email;
  const updatedData = {};
  const fields = ["firstName", "lastName", "email", "phone", "nin", "dob", "gender"];
  fields.forEach((field) => {
    if (req.body[field]) updatedData[field] = req.body[field];
  });

  // If email is changing, send notification to both old and new
  if (updatedData.email && updatedData.email !== oldEmail) {
    try {
      await sendEmailChangeNotification({
        firstName: updatedData.firstName || admin.firstName,
        lastName: updatedData.lastName || admin.lastName,
        oldEmail,
        newEmail: updatedData.email,
        role: "Administrator"
      });
      console.log(`✅ Email change notification sent for admin ${oldEmail} → ${updatedData.email}`);
    } catch (emailError) {
      console.error(`⚠️ Failed to send email change notification:`, emailError.message);
    }
  }

  admin = await User.findByIdAndUpdate(id, updatedData, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    message: "Admin profile updated!",
    admin,
  });
});


// Delete an admin (principal admin only, cannot delete self)
export const deleteAdmin = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const admin = await User.findById(id);
  if (!admin) {
    return next(new ErrorHandler("Admin not found!", 404));
  }
  if (admin.role !== "Admin") {
    return next(new ErrorHandler("This user is not an admin!", 400));
  }
  if (admin.email === "admin@ilera.com") {
    return next(new ErrorHandler("Cannot remove the principal admin!", 400));
  }

  await admin.deleteOne();
  res.status(200).json({
    success: true,
    message: "Admin removed successfully!",
  });
});
