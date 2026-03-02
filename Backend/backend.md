# Backend — Ìlera Health & Wellness Management System

## 2.3 System Architecture

The Ìlera Health & Wellness Management System follows a **Three-Tier Client-Server Architecture**, which separates the system into three logical layers:

```
┌───────────────────────────────────────────────────────────────────────────────┐
│                           PRESENTATION TIER                                   │
│                                                                               │
│   ┌──────────────────┐   ┌──────────────────┐   ┌──────────────────┐        │
│   │  Patient Portal  │   │ Admin Dashboard  │   │  Doctor Portal  │        │
│   │  (React.js SPA)  │   │  (React.js SPA)  │   │  (React.js SPA) │        │
│   │  Base: /patient/  │   │  Base: /admin/   │   │  Base: /doctors/ │        │
│   │  Context API      │   │  Context API     │   │  Context API     │        │
│   └────────┬─────────┘   └────────┬─────────┘   └────────┬────────┘        │
│            │ Axios + Cookies      │ Axios + Cookies       │ Axios + Cookies  │
└────────────┼──────────────────────┼───────────────────────┼──────────────────┘
             │                      │                       │
             ▼                      ▼                       ▼
┌───────────────────────────────────────────────────────────────────────────────┐
│                           APPLICATION TIER                                    │
│                                                                               │
│   ┌───────────────────────────────────────────────────────────────────┐      │
│   │              Node.js + Express.js REST API (Port: 4000)          │      │
│   │                                                                   │      │
│   │  ┌──────────────────────────────────────────────────────────┐    │      │
│   │  │                    CORS Middleware                        │    │      │
│   │  │  Origins: FRONTEND_PATIENT, FRONTEND_ADMIN,              │    │      │
│   │  │           FRONTEND_DOCTOR                                │    │      │
│   │  │  Methods: GET, POST, PUT, DELETE                         │    │      │
│   │  │  Credentials: true (cookies)                             │    │      │
│   │  └──────────────────────────────────────────────────────────┘    │      │
│   │                                                                   │      │
│   │  ┌──────────┐  ┌──────────────┐  ┌───────────────────────┐      │      │
│   │  │  Routes   │→│  Controllers │→│  Middlewares            │      │      │
│   │  │           │  │              │  │                        │      │      │
│   │  │ /message  │  │ userCtrl     │  │ isAdminAuthenticated  │      │      │
│   │  │ /user     │  │ appointCtrl  │  │ isPatientAuthenticated│      │      │
│   │  │ /appoint  │  │ messageCtrl  │  │ isDoctorAuthenticated │      │      │
│   │  │ ment      │  │              │  │ isPrincipalAdmin      │      │      │
│   │  └──────────┘  └──────────────┘  │ errorMiddleware       │      │      │
│   │                                   │ catchAsyncErrors      │      │      │
│   │                                   └───────────────────────┘      │      │
│   │                                                                   │      │
│   │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────────┐      │      │
│   │  │ JWT Auth │  │ Bcrypt   │  │Cloudinary│  │ Nodemailer │      │      │
│   │  │ (3 named │  │ (password│  │  (Doctor │  │  (Gmail    │      │      │
│   │  │  cookies:│  │  hashing)│  │  avatar  │  │   SMTP)    │      │      │
│   │  │ adminTkn │  │          │  │  upload) │  │            │      │      │
│   │  │ patntTkn │  └──────────┘  └──────────┘  └────────────┘      │      │
│   │  │ doctrTkn │                                                    │      │
│   │  └──────────┘                                                    │      │
│   │                                                                   │      │
│   │  ┌──────────────────────────────────────────────────────────┐    │      │
│   │  │              Additional Middleware Stack                  │    │      │
│   │  │  cookie-parser · express.json · express.urlencoded       │    │      │
│   │  │  express-fileupload (tempFiles → /tmp/)                  │    │      │
│   │  └──────────────────────────────────────────────────────────┘    │      │
│   └───────────────────────────────────────────────────────────────────┘      │
│                             │                                                 │
└─────────────────────────────┼─────────────────────────────────────────────────┘
                              │ Mongoose ODM
                              ▼
┌───────────────────────────────────────────────────────────────────────────────┐
│                             DATA TIER                                         │
│                                                                               │
│   ┌───────────────────────────────────────────────────────────────────┐      │
│   │        MongoDB Atlas — Database: "Ilera_Hospital"                 │      │
│   │                                                                   │      │
│   │  ┌────────────────┐  ┌──────────────────┐  ┌────────────────┐   │      │
│   │  │     users       │  │   appointments   │  │    messages    │   │      │
│   │  │ (Admin/Patient/ │  │ (5-state workflow │  │ (contact form │   │      │
│   │  │  Doctor roles)  │  │  with references) │  │  submissions) │   │      │
│   │  └────────────────┘  └──────────────────┘  └────────────────┘   │      │
│   └───────────────────────────────────────────────────────────────────┘      │
│                                                                               │
│   ┌──────────────────────────────┐   ┌──────────────────────────────┐       │
│   │  Cloudinary (Cloud Storage)  │   │  Gmail SMTP (Email Service) │       │
│   │  Doctor Avatar Images        │   │  Nodemailer Transporter      │       │
│   │  Upload / Destroy API        │   │  Doctor & Admin Welcome      │       │
│   └──────────────────────────────┘   │  Email Change Notifications  │       │
│                                      └──────────────────────────────┘       │
└───────────────────────────────────────────────────────────────────────────────┘
```

**Figure 2.1**: Three-Tier Architecture of the Ìlera Health & Wellness Management System

### 2.3.1 Architectural Pattern — Model-View-Controller (MVC)

The backend follows the **MVC (Model-View-Controller)** architectural pattern:

- **Model Layer**: Mongoose schemas (`userSchema.js`, `appointmentSchema.js`, `messageSchema.js`) define the data structure and validation rules. The User model includes instance methods for password hashing (`pre-save` hook with bcrypt), password comparison (`comparePassword`), and JWT generation (`generateJsonWebToken`). The Appointment model uses `timestamps: true` for automatic `createdAt`/`updatedAt` tracking.
- **Controller Layer**: Controller files (`userController.js`, `appointmentController.js`, `messageController.js`) contain the business logic for handling HTTP requests. The user controller handles 14 operations (register, login, 3 logouts, add doctor/admin, get doctors/admins, get user details, edit/delete doctor, edit/delete admin). The appointment controller handles 10 operations (post, get my, get all, assign, get by dept, doctor assigned, doctor unassigned, self-assign, respond, mark completed, update status, delete). The message controller handles 2 operations (send, get all).
- **View Layer**: In this REST API architecture, views are decoupled from the server. The three React.js frontends serve as the view layer, consuming the API endpoints via Axios with `withCredentials: true` for cookie-based authentication.

### 2.3.2 Component Interaction Diagram

```
                                    ┌─────────────────────────────────────┐
                                    │         EXTERNAL SERVICES           │
                                    │                                     │
                                    │  ┌─────────────┐ ┌──────────────┐  │
                                    │  │  Cloudinary  │ │ Gmail SMTP   │  │
                                    │  │  (Avatars)   │ │ (Nodemailer) │  │
                                    │  └──────┬───────┘ └──────┬───────┘  │
                                    └─────────┼────────────────┼──────────┘
                                              │                │
┌──────────────┐                              │                │
│ Patient SPA  │──┐                           │                │
│ (React.js)   │  │                           │                │
└──────────────┘  │   HTTP + Cookies          │                │
                  │   (Axios)                 │                │
┌──────────────┐  │  ┌──────────┐  ┌─────────┴────────────────┴──────┐
│  Admin SPA   │──┼─→│  Router  │─→│          Controller Layer        │
│ (React.js)   │  │  │  Layer   │  │                                  │
└──────────────┘  │  │          │  │  userController.js               │
                  │  │ /user/*  │  │  ├─ patientRegister              │
┌──────────────┐  │  │ /appoint │  │  ├─ login (role-based)           │
│ Doctor SPA   │──┘  │  ment/*  │  │  ├─ addNewAdmin (+email)         │
│ (React.js)   │     │ /message │  │  ├─ addNewDoctor (+email+avatar) │
└──────────────┘     │  /*      │  │  ├─ getAllDoctors / getAllAdmins  │
                     └────┬─────┘  │  ├─ editDoctor / editAdmin       │
                          │        │  ├─ deleteDoctor / deleteAdmin    │
                          ▼        │  ├─ logoutAdmin/Patient/Doctor    │
                     ┌──────────┐  │  └─ getUserDetails                │
                     │Middleware│  │                                    │
                     │  Stack   │  │  appointmentController.js         │
                     │          │  │  ├─ postAppointment               │
                     │ Auth:    │  │  ├─ getMyAppointments             │
                     │ ┌──────┐ │  │  ├─ getAllAppointments            │
                     │ │Admin │ │  │  ├─ assignDoctor                  │
                     │ │Token │ │  │  ├─ getDoctorsByDepartment        │
                     │ ├──────┤ │  │  ├─ getDoctorAssignedAppointments │
                     │ │Patient│ │  │  ├─ getDoctorDeptUnassigned      │
                     │ │Token │ │  │  ├─ doctorSelfAssign              │
                     │ ├──────┤ │  │  ├─ doctorRespondToAssignment     │
                     │ │Doctor│ │  │  ├─ doctorMarkCompleted           │
                     │ │Token │ │  │  ├─ updateAppointmentStatus       │
                     │ ├──────┤ │  │  └─ deleteAppointment             │
                     │ │Prncpl│ │  │                                    │
                     │ │Admin │ │  │  messageController.js              │
                     │ └──────┘ │  │  ├─ sendMessage (public)           │
                     │          │  │  └─ getAllMessages (admin only)     │
                     │ Error:   │  └──────────────┬───────────────────┘
                     │ ┌──────┐ │                  │
                     │ │Catch │ │                  │ Mongoose Queries
                     │ │Async │ │                  │
                     │ ├──────┤ │                  ▼
                     │ │Error │ │            ┌──────────────┐
                     │ │Middlw│ │            │   Models     │
                     │ └──────┘ │            │  (Mongoose)  │
                     └──────────┘            │              │
                                             │ User         │
                                             │ Appointment  │──→ MongoDB Atlas
                                             │ Message      │    "Ilera_Hospital"
                                             └──────────────┘
```

**Figure 2.2**: Request-Response Lifecycle and Component Interaction

**Key Interaction Flows:**

1. **Patient Registration**: Patient SPA → `POST /api/v1/user/patient/register` → `patientRegister` controller → User model → MongoDB → JWT cookie (`patientToken`) → Response
2. **Appointment Booking**: Patient SPA → `POST /api/v1/appointment/post` → `isPatientAuthenticated` middleware → `postAppointment` controller → Appointment model (status: "Pending") → MongoDB → Response
3. **Doctor Assignment**: Admin SPA → `PUT /api/v1/appointment/assign` → `isAdminAuthenticated` middleware → `assignDoctor` controller → validates doctor department match → Appointment model (status: "Assigned") → Response
4. **Doctor Response**: Doctor SPA → `PUT /api/v1/appointment/doctor/respond` → `isDoctorAuthenticated` middleware → `doctorRespondToAssignment` controller → Appointment model (status: "Accepted" or "Rejected") → Response
5. **Doctor Registration**: Admin SPA → `POST /api/v1/user/doctor/addnew` → `isAdminAuthenticated` middleware → `addNewDoctor` controller → Nodemailer (welcome email) → Cloudinary (avatar upload) → User model (role: "Doctor") → Response

---

## 2.4 System Models

### 2.4.1 Entity-Relationship Diagram (ERD)

```
┌──────────────────────────────────────┐
│              USER                     │
├──────────────────────────────────────┤
│ _id          : ObjectId (PK)         │
│ firstName    : String (min: 3)       │
│ lastName     : String (min: 2)       │
│ email        : String (validated)    │
│ phone        : String (exactly 11)   │
│ nin          : String (exactly 11)   │
│ dob          : Date (required)       │
│ gender       : Enum [Male, Female,   │
│                      Others]         │
│ password     : String (min: 8,       │
│                hashed, select:false) │
│ role         : Enum [Admin, Patient, │
│                      Doctor]         │
│ doctrDptmnt  : String (Doctor only)  │
│ doctrAvatar  : {                     │
│   public_id  : String,              │
│   url        : String               │
│ }            (Doctor only)           │
├──────────────────────────────────────┤
│ Methods:                              │
│  pre("save") → bcrypt.hash(pwd, 10) │
│  comparePassword(entered) → Boolean  │
│  generateJsonWebToken() → JWT string │
└───────────┬──────────────────────────┘
            │
            │ 1:N (as Patient via patientId)
            │ 0:N (as Doctor via doctorId)
            │
            ▼
┌──────────────────────────────────────┐
│           APPOINTMENT                 │
├──────────────────────────────────────┤
│ _id              : ObjectId (PK)     │
│ patientId        : ObjectId (FK)     │──→ References USER (role=Patient)
│ patientFirstName : String            │
│ patientLastName  : String            │
│ patientEmail     : String            │
│ patientPhone     : String            │
│ department       : String            │
│ condition        : String (min: 5)   │
│ appointment_date : String            │
│ address          : String            │
│ doctor           : {                 │
│   firstName      : String (null),   │
│   lastName       : String (null)    │
│ }                                    │
│ doctorId         : ObjectId (FK)     │──→ References USER (role=Doctor)
│                    (default: null)   │
│ hasVisited       : Boolean (false)   │
│ status           : Enum [            │
│   "Pending",                         │    ← Initial state (no doctor)
│   "Assigned",                        │    ← Admin assigned a doctor
│   "Accepted",                        │    ← Doctor accepted / self-assigned
│   "Rejected",                        │    ← Doctor declined assignment
│   "Completed"                        │    ← Doctor marked visit done
│ ]                                    │
│ createdAt        : Date (auto)       │
│ updatedAt        : Date (auto)       │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│            MESSAGE                    │
├──────────────────────────────────────┤
│ _id       : ObjectId (PK)            │
│ firstName : String (min: 3)          │
│ lastName  : String (min: 3)          │
│ email     : String (validated)       │
│ phone     : String (exactly 11)      │
│ message   : String (min: 10)         │
├──────────────────────────────────────┤
│ Note: No foreign key to User.        │
│ Messages are standalone contact      │
│ form submissions (public endpoint).  │
└──────────────────────────────────────┘

Relationships:
─────────────
USER (Patient) ──1:N──→ APPOINTMENT  (via patientId)
USER (Doctor)  ──0:N──→ APPOINTMENT  (via doctorId, nullable)
MESSAGE        ──(none)──→ USER       (standalone entity)

Appointment Status State Machine:
─────────────────────────────────
  ┌─────────┐   Admin assigns    ┌──────────┐   Doctor accepts   ┌──────────┐
  │ Pending │ ─────────────────→ │ Assigned │ ─────────────────→ │ Accepted │
  └─────────┘                    └──────────┘                    └────┬─────┘
       ▲                              │                               │
       │                              │ Doctor declines               │ Doctor marks
       │                              ▼                               │ completed
       │                         ┌──────────┐                    ┌────▼──────┐
       │                         │ Rejected │                    │ Completed │
       │                         └────┬─────┘                    └───────────┘
       │                              │
       │   Admin reassigns            │
       └──────────────────────────────┘

  Alternative path (Doctor self-assigns from unassigned pool):
  ┌─────────┐   Doctor self-assigns   ┌──────────┐
  │ Pending │ ──────────────────────→ │ Accepted │
  └─────────┘                         └──────────┘
```

**Figure 2.3**: Entity-Relationship Diagram

### 2.4.2 Use Case Diagram

```
                            ┌──────────────────────────────────────────────────────────┐
                            │           Ìlera Health & Wellness System                  │
                            │                                                          │
  ┌──────────┐              │   ┌──────────────────────────────────┐                   │
  │          │──────────────┼──→│ Register Account (self-service)  │                   │
  │          │              │   └──────────────────────────────────┘                   │
  │          │              │   ┌──────────────────────────────────┐                   │
  │          │──────────────┼──→│ Login / Logout                   │                   │
  │          │              │   └──────────────────────────────────┘                   │
  │          │              │   ┌──────────────────────────────────┐                   │
  │ Patient  │──────────────┼──→│ Book Appointment                 │                   │
  │          │              │   │ (select dept, condition, date,   │                   │
  │          │              │   │  address — no doctor selection)  │                   │
  │          │              │   └──────────────────────────────────┘                   │
  │          │              │   ┌──────────────────────────────────┐                   │
  │          │──────────────┼──→│ View My Appointments + Status    │                   │
  │          │              │   │ (with assigned doctor details)   │                   │
  │          │              │   └──────────────────────────────────┘                   │
  │          │              │   ┌──────────────────────────────────┐                   │
  │          │──────────────┼──→│ Send Message to Admin            │                   │
  │          │              │   │ (public contact form)            │                   │
  │          │              │   └──────────────────────────────────┘                   │
  │          │              │   ┌──────────────────────────────────┐                   │
  │          │──────────────┼──→│ View Hospital Info / Departments │                   │
  └──────────┘              │   └──────────────────────────────────┘                   │
                            │                                                          │
  ┌──────────┐              │   ┌──────────────────────────────────┐                   │
  │ Principal│──────────────┼──→│ Login / Logout                   │                   │
  │  Admin   │              │   └──────────────────────────────────┘                   │
  │ (admin@  │              │   ┌──────────────────────────────────┐                   │
  │ ilera.   │──────────────┼──→│ View All Appointments Dashboard  │                   │
  │ com)     │              │   │ (with status filtering)          │                   │
  │          │              │   └──────────────────────────────────┘                   │
  │          │              │   ┌──────────────────────────────────┐                   │
  │          │──────────────┼──→│ Assign Doctor to Appointment     │                   │
  │          │              │   │ (filtered by department match)   │                   │
  │          │              │   └──────────────────────────────────┘                   │
  │          │              │   ┌──────────────────────────────────┐                   │
  │          │──────────────┼──→│ Add Doctor (+email +avatar)      │                   │
  │          │              │   └──────────────────────────────────┘                   │
  │          │              │   ┌──────────────────────────────────┐                   │
  │          │──────────────┼──→│ Edit / Remove Doctors            │  ← Principal only │
  │          │              │   └──────────────────────────────────┘                   │
  │          │              │   ┌──────────────────────────────────┐                   │
  │          │──────────────┼──→│ Add New Admin (+email invite)    │  ← Principal only │
  │          │              │   └──────────────────────────────────┘                   │
  │          │              │   ┌──────────────────────────────────┐                   │
  │          │──────────────┼──→│ Edit / Remove Admins             │  ← Principal only │
  │          │              │   │ (cannot remove self)             │                   │
  │          │              │   └──────────────────────────────────┘                   │
  │          │              │   ┌──────────────────────────────────┐                   │
  │          │──────────────┼──→│ View All Messages                │                   │
  │          │              │   └──────────────────────────────────┘                   │
  │          │              │   ┌──────────────────────────────────┐                   │
  │          │──────────────┼──→│ View All Doctors                 │                   │
  └──────────┘              │   └──────────────────────────────────┘                   │
                            │                                                          │
  ┌──────────┐              │   ┌──────────────────────────────────┐                   │
  │ Secondary│──────────────┼──→│ Login / Logout                   │                   │
  │  Admin   │              │   └──────────────────────────────────┘                   │
  │          │              │   ┌──────────────────────────────────┐                   │
  │          │──────────────┼──→│ View All Appointments Dashboard  │                   │
  │          │              │   └──────────────────────────────────┘                   │
  │          │              │   ┌──────────────────────────────────┐                   │
  │          │──────────────┼──→│ Assign Doctor to Appointment     │                   │
  │          │              │   └──────────────────────────────────┘                   │
  │          │              │   ┌──────────────────────────────────┐                   │
  │          │──────────────┼──→│ Add Doctor (+email +avatar)      │                   │
  │          │              │   └──────────────────────────────────┘                   │
  │          │              │   ┌──────────────────────────────────┐                   │
  │          │──────────────┼──→│ View All Doctors (read-only)     │                   │
  │          │              │   └──────────────────────────────────┘                   │
  │          │              │   ┌──────────────────────────────────┐                   │
  │          │──────────────┼──→│ View All Messages                │                   │
  └──────────┘              │   └──────────────────────────────────┘                   │
                            │                                                          │
  ┌──────────┐              │   ┌──────────────────────────────────┐                   │
  │          │──────────────┼──→│ Login / Logout                   │                   │
  │          │              │   └──────────────────────────────────┘                   │
  │          │              │   ┌──────────────────────────────────┐                   │
  │  Doctor  │──────────────┼──→│ View Assigned Appointments       │                   │
  │          │              │   │ (My Patients tab)                │                   │
  │          │              │   └──────────────────────────────────┘                   │
  │          │              │   ┌──────────────────────────────────┐                   │
  │          │──────────────┼──→│ Accept / Reject Admin Assignment │                   │
  │          │              │   │ (respond to "Assigned" status)   │                   │
  │          │              │   └──────────────────────────────────┘                   │
  │          │              │   ┌──────────────────────────────────┐                   │
  │          │──────────────┼──→│ Self-Assign Unassigned Appts     │                   │
  │          │              │   │ (same department, Pending only)  │                   │
  │          │              │   └──────────────────────────────────┘                   │
  │          │              │   ┌──────────────────────────────────┐                   │
  │          │──────────────┼──→│ Mark Appointment Completed       │                   │
  │          │              │   │ (Accepted → Completed)           │                   │
  │          │              │   └──────────────────────────────────┘                   │
  │          │              │   ┌──────────────────────────────────┐                   │
  │          │──────────────┼──→│ View Unassigned Dept Appointments│                   │
  └──────────┘              │   │ (Unassigned tab)                 │                   │
                            │   └──────────────────────────────────┘                   │
                            │                                                          │
  ┌──────────┐              │   ┌──────────────────────────────────┐                   │
  │  Visitor │──────────────┼──→│ Send Message (public, no auth)   │                   │
  │ (Unauth) │              │   └──────────────────────────────────┘                   │
  │          │              │   ┌──────────────────────────────────┐                   │
  │          │──────────────┼──→│ View Hospital Info / Departments │                   │
  └──────────┘              │   └──────────────────────────────────┘                   │
                            └──────────────────────────────────────────────────────────┘
```

**Figure 2.4**: Use Case Diagram

**Actor Descriptions:**

| Actor | Description | Authentication |
|-------|-------------|----------------|
| **Patient** | Registered user who books appointments and tracks their status | `patientToken` cookie via JWT |
| **Principal Admin** | The root administrator (`admin@ilera.com`) with full CRUD over doctors and admins | `adminToken` cookie + `isPrincipalAdmin` middleware |
| **Secondary Admin** | Additional administrators who can add doctors, assign appointments, and view messages but cannot edit/delete other admins or doctors | `adminToken` cookie via JWT |
| **Doctor** | Medical staff registered by an admin, manages assigned appointments | `doctorToken` cookie via JWT |
| **Visitor** | Unauthenticated user who can browse the patient portal and send contact messages | No authentication required |
