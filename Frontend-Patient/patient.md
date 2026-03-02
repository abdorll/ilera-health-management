# Frontend-Patient — Ìlera Health & Wellness Patient Portal

## 2.3 System Architecture

The Patient Portal is a **React.js Single-Page Application (SPA)** that serves as the public-facing interface for the Ìlera Health & Wellness Management System. It provides both unauthenticated (visitor) and authenticated (patient) experiences, including hospital information, appointment booking, appointment tracking, and contact messaging.

```
┌───────────────────────────────────────────────────────────────────────────────┐
│                    PATIENT PORTAL — PRESENTATION TIER                         │
│                                                                               │
│   ┌───────────────────────────────────────────────────────────────────┐      │
│   │                    React.js SPA (Vite Build)                      │      │
│   │                    Base Path: /patient/                            │      │
│   │                                                                   │      │
│   │  ┌─────────────────────────────────────────────────────────┐     │      │
│   │  │              Context API (Global State)                  │     │      │
│   │  │  ┌─────────────────┐  ┌──────────────────────────┐     │     │      │
│   │  │  │ isAuthenticated │  │ user (patient object)     │     │     │      │
│   │  │  │ (boolean)       │  │ {firstName, lastName,     │     │     │      │
│   │  │  │                 │  │  email, role, ...}        │     │     │      │
│   │  │  └─────────────────┘  └──────────────────────────┘     │     │      │
│   │  └─────────────────────────────────────────────────────────┘     │      │
│   │                                                                   │      │
│   │  ┌─────────────────────────────────────────────────────────┐     │      │
│   │  │              React Router (BrowserRouter)                │     │      │
│   │  │                                                          │     │      │
│   │  │  AUTHENTICATED ROUTES:                                   │     │      │
│   │  │  /              → PatientDashboard (appointment tracker) │     │      │
│   │  │  /appointment   → Appointment (booking form)             │     │      │
│   │  │  /dashboard     → PatientDashboard (alias)               │     │      │
│   │  │                                                          │     │      │
│   │  │  UNAUTHENTICATED ROUTES:                                 │     │      │
│   │  │  /              → Home (hero, bio, departments, contact) │     │      │
│   │  │  /about         → AboutUs (hero, biography)              │     │      │
│   │  │  /register      → Register (patient self-registration)   │     │      │
│   │  │  /login         → Login (patient sign-in)                │     │      │
│   │  │                                                          │     │      │
│   │  │  ALWAYS ACCESSIBLE:                                      │     │      │
│   │  │  /appointment   → Appointment (booking form)             │     │      │
│   │  └─────────────────────────────────────────────────────────┘     │      │
│   │                                                                   │      │
│   │  ┌─────────────────────────────────────────────────────────┐     │      │
│   │  │              Navbar (conditional rendering)              │     │      │
│   │  │  Logged out: Home | About Us | Book Appointment | SignIn│     │      │
│   │  │  Logged in:  Dashboard | {user name} | Logout           │     │      │
│   │  └─────────────────────────────────────────────────────────┘     │      │
│   │                                                                   │      │
│   │  ┌─────────────────────────────────────────────────────────┐     │      │
│   │  │              Footer (shown only when logged out)         │     │      │
│   │  └─────────────────────────────────────────────────────────┘     │      │
│   └───────────────────────────────────────────────────────────────────┘      │
│                             │                                                 │
│                             │ Axios HTTP (withCredentials: true)               │
│                             │ Cookie: patientToken                            │
│                             ▼                                                 │
│   ┌───────────────────────────────────────────────────────────────────┐      │
│   │              Backend REST API (Express.js)                        │      │
│   │              VITE_API_URL environment variable                    │      │
│   │                                                                   │      │
│   │  Consumed Endpoints:                                              │      │
│   │  ├─ POST   /api/v1/user/patient/register                        │      │
│   │  ├─ POST   /api/v1/user/login {role: "Patient"}                 │      │
│   │  ├─ GET    /api/v1/user/patient/me                               │      │
│   │  ├─ GET    /api/v1/user/patient/logout                           │      │
│   │  ├─ POST   /api/v1/appointment/post                              │      │
│   │  ├─ GET    /api/v1/appointment/myappointments                    │      │
│   │  └─ POST   /api/v1/message/send (public, no auth)               │      │
│   └───────────────────────────────────────────────────────────────────┘      │
└───────────────────────────────────────────────────────────────────────────────┘
```

**Figure 2.1**: Patient Portal Architecture within the Three-Tier System

### Component Interaction Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    Patient SPA Component Tree                           │
│                                                                         │
│  main.jsx                                                               │
│  └─ Context.Provider {isAuthenticated, user}                            │
│     └─ App.jsx                                                          │
│        ├─ useEffect → GET /user/patient/me → sets auth state            │
│        ├─ Navbar.jsx (always rendered)                                  │
│        │  ├─ Reads: isAuthenticated, user (from Context)                │
│        │  ├─ If logged out: Home, About Us, Book Appointment, Sign In   │
│        │  ├─ If logged in: Dashboard, user name, Logout button          │
│        │  └─ handleLogout → GET /user/patient/logout                    │
│        │                                                                │
│        ├─ Routes (AUTHENTICATED — isAuthenticated === true)             │
│        │  ├─ "/" → PatientDashboard.jsx                                 │
│        │  │  ├─ useEffect → GET /appointment/myappointments             │
│        │  │  │   (populated with doctorId → doctor details)             │
│        │  │  ├─ Stats Cards:                                            │
│        │  │  │  ├─ Total Appointments                                   │
│        │  │  │  ├─ Pending count                                        │
│        │  │  │  └─ Accepted count                                       │
│        │  │  ├─ Expandable Appointment Cards:                           │
│        │  │  │  ├─ Department + Date badge                              │
│        │  │  │  ├─ Status badge (Pending/Assigned/Accepted/             │
│        │  │  │  │   Rejected→"Being Reassigned"/Completed)              │
│        │  │  │  ├─ Condition description                                │
│        │  │  │  ├─ Address                                              │
│        │  │  │  ├─ If doctor assigned: Doctor Profile Card              │
│        │  │  │  │  ├─ Avatar image (from Cloudinary)                    │
│        │  │  │  │  ├─ Dr. name, department                              │
│        │  │  │  │  └─ Email, phone                                      │
│        │  │  │  └─ If no doctor: "Awaiting Doctor Assignment" message   │
│        │  │  └─ Empty state: "No appointments yet" + Book Now link      │
│        │  │                                                             │
│        │  ├─ "/appointment" → Appointment.jsx                           │
│        │  │  ├─ Hero component (header image)                           │
│        │  │  └─ AppointmentForm.jsx                                     │
│        │  │     ├─ Department grid (9 departments with icons)           │
│        │  │     │  Pediatrics, Orthopedics, Cardiology, Neurology,      │
│        │  │     │  Oncology, Radiology, Physical Therapy, Dermatology,  │
│        │  │     │  ENT                                                  │
│        │  │     ├─ Condition textarea                                   │
│        │  │     ├─ Date picker (min: today)                             │
│        │  │     ├─ Address textarea                                     │
│        │  │     ├─ "Visited before" checkbox                            │
│        │  │     └─ handleAppointment → POST /appointment/post           │
│        │  │        {department, condition, appointment_date,             │
│        │  │         address, hasVisited}                                 │
│        │  │        (patientId auto-populated from auth token)           │
│        │  │                                                             │
│        │  └─ "/dashboard" → PatientDashboard.jsx (alias)                │
│        │                                                                │
│        ├─ Routes (UNAUTHENTICATED — isAuthenticated === false)          │
│        │  ├─ "/" → Home.jsx                                             │
│        │  │  ├─ Hero.jsx (title + hero image)                           │
│        │  │  ├─ Biography.jsx (about section)                           │
│        │  │  ├─ Departments.jsx (9 department cards with images)        │
│        │  │  └─ MessageForm.jsx                                         │
│        │  │     └─ handleMessage → POST /message/send                   │
│        │  │        {firstName, lastName, email, phone, message}          │
│        │  │        (public endpoint, no authentication required)         │
│        │  │                                                             │
│        │  ├─ "/about" → AboutUs.jsx                                     │
│        │  │  ├─ Hero.jsx                                                │
│        │  │  └─ Biography.jsx                                           │
│        │  │                                                             │
│        │  ├─ "/register" → Register.jsx                                 │
│        │  │  └─ handleRegister → POST /user/patient/register            │
│        │  │     {firstName, lastName, email, phone, password,            │
│        │  │      gender, nin, dob, role: "Patient"}                     │
│        │  │     → auto-login on success (sets auth + user)              │
│        │  │                                                             │
│        │  └─ "/login" → Login.jsx                                       │
│        │     └─ handleLogin → POST /user/login                          │
│        │        {email, password, confirmPassword: password,             │
│        │         role: "Patient"}                                        │
│        │                                                                │
│        ├─ Route (ALWAYS ACCESSIBLE)                                     │
│        │  └─ "/appointment" → Appointment.jsx                           │
│        │                                                                │
│        └─ Footer.jsx (rendered only when !isAuthenticated)              │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

**Figure 2.2**: Patient Portal Component Interaction and Data Flow

---

## 2.4 System Models

### 2.4.1 Entity-Relationship Diagram (ERD)

The Patient Portal interacts with the User, Appointment, and Message entities:

```
┌──────────────────────────────────────┐
│              USER (Patient)           │
├──────────────────────────────────────┤
│ _id          : ObjectId (PK)         │
│ firstName    : String (min: 3)       │
│ lastName     : String (min: 2)       │
│ email        : String (validated)    │
│ phone        : String (exactly 11)   │
│ nin          : String (exactly 11)   │
│ dob          : Date                  │
│ gender       : Enum [Male, Female,   │
│                      Others]         │
│ password     : String (hashed)       │
│ role         : "Patient"             │
├──────────────────────────────────────┤
│ Patient Portal Operations:            │
│  • POST register (self-service)       │
│  • POST login                         │
│  • GET /user/patient/me (own profile)│
│  • GET /user/patient/logout           │
└───────────┬──────────────────────────┘
            │
            │ 1:N (Patient → Appointments via patientId)
            ▼
┌──────────────────────────────────────┐
│           APPOINTMENT                 │
├──────────────────────────────────────┤
│ _id              : ObjectId          │
│ patientId        : ObjectId (FK)     │──→ References this Patient
│ patientFirstName : String            │    (auto-populated from auth)
│ patientLastName  : String            │
│ patientEmail     : String            │
│ patientPhone     : String            │
│ department       : String            │
│ condition        : String (min: 5)   │
│ appointment_date : String            │
│ address          : String            │
│ doctor           : {firstName,       │
│                    lastName}         │
│ doctorId         : ObjectId (FK)     │──→ References USER (Doctor)
│                    (populated on GET)│    (avatar, email, phone, dept)
│ hasVisited       : Boolean           │
│ status           : Enum              │
├──────────────────────────────────────┤
│ Patient Portal Operations:            │
│  • POST /appointment/post             │
│    (creates with status: "Pending")   │
│  • GET /appointment/myappointments    │
│    (with populated doctor details)    │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│            MESSAGE                    │
├──────────────────────────────────────┤
│ _id       : ObjectId                 │
│ firstName : String (min: 3)          │
│ lastName  : String (min: 3)          │
│ email     : String (validated)       │
│ phone     : String (exactly 11)      │
│ message   : String (min: 10)         │
├──────────────────────────────────────┤
│ Patient Portal Operations:            │
│  • POST /message/send                 │
│    (public, no auth required)         │
│    (standalone, no FK to User)        │
└──────────────────────────────────────┘

Patient's Appointment Status View:
──────────────────────────────────
  Status          │ Patient Sees                    │ Meaning
  ────────────────┼─────────────────────────────────┼──────────────────────────
  Pending         │ "Pending"                       │ Waiting for doctor assignment
  Assigned        │ "Doctor Assigned"               │ Admin assigned a doctor
  Accepted        │ "Doctor Accepted"               │ Doctor confirmed the appointment
  Rejected        │ "Being Reassigned"              │ Doctor declined, admin will reassign
  Completed       │ "Completed"                     │ Visit has been completed
```

**Figure 2.3**: ERD from the Patient Portal Perspective

### 2.4.2 Use Case Diagram

```
                         ┌──────────────────────────────────────────────────────┐
                         │          Patient Portal Use Cases                     │
                         │                                                      │
  ┌──────────┐           │   ┌────────────────────────────────────┐            │
  │          │───────────┼──→│ View Home Page                      │            │
  │          │           │   │ • Hero section                      │            │
  │          │           │   │ • Hospital biography                │            │
  │          │           │   │ • 9 Department cards                │            │
  │          │           │   │ • Contact form (MessageForm)        │            │
  │ Visitor  │           │   └────────────────────────────────────┘            │
  │ (Unauth) │           │                                                      │
  │          │           │   ┌────────────────────────────────────┐            │
  │          │───────────┼──→│ View About Us Page                  │            │
  │          │           │   └────────────────────────────────────┘            │
  │          │           │                                                      │
  │          │           │   ┌────────────────────────────────────┐            │
  │          │───────────┼──→│ Send Contact Message (public)       │            │
  │          │           │   │ (no login required)                 │            │
  │          │           │   └────────────────────────────────────┘            │
  │          │           │                                                      │
  │          │           │   ┌────────────────────────────────────┐            │
  │          │───────────┼──→│ Register as Patient                 │            │
  │          │           │   │ (auto-login on success)             │            │
  │          │           │   └────────────────────────────────────┘            │
  │          │           │                                                      │
  │          │           │   ┌────────────────────────────────────┐            │
  │          │───────────┼──→│ Login as Patient                    │            │
  └──────────┘           │   └────────────────────────────────────┘            │
                         │                                                      │
  ┌──────────┐           │   ┌────────────────────────────────────┐            │
  │          │───────────┼──→│ View Patient Dashboard              │            │
  │          │           │   │ • Stats: Total, Pending, Accepted   │            │
  │          │           │   │ • Expandable appointment cards       │            │
  │          │           │   │ • Doctor profile (when assigned)     │            │
  │          │           │   │ • Status tracking across 5 states    │            │
  │          │           │   └────────────────────────────────────┘            │
  │          │           │                                                      │
  │ Patient  │           │   ┌────────────────────────────────────┐            │
  │ (Auth)   │───────────┼──→│ Book Appointment                    │            │
  │          │           │   │ • Select department (9 options)     │            │
  │          │           │   │ • Describe condition                 │            │
  │          │           │   │ • Choose preferred date              │            │
  │          │           │   │ • Provide address                    │            │
  │          │           │   │ • Mark if visited before             │            │
  │          │           │   │ (No doctor selection — admin assigns)│            │
  │          │           │   └────────────────────────────────────┘            │
  │          │           │                                                      │
  │          │           │   ┌────────────────────────────────────┐            │
  │          │───────────┼──→│ Track Appointment Status             │            │
  │          │           │   │ • Pending → Assigned → Accepted     │            │
  │          │           │   │   → Completed                       │            │
  │          │           │   │ • View assigned doctor details       │            │
  │          │           │   │   (avatar, name, dept, email, phone)│            │
  │          │           │   └────────────────────────────────────┘            │
  │          │           │                                                      │
  │          │           │   ┌────────────────────────────────────┐            │
  │          │───────────┼──→│ Logout                              │            │
  └──────────┘           │   └────────────────────────────────────┘            │
                         └──────────────────────────────────────────────────────┘
```

**Figure 2.4**: Patient Portal Use Case Diagram

**Patient Journey Summary:**

| Step | Action | Where | Auth Required |
|------|--------|-------|:---:|
| 1 | Visit hospital website | Home page | ❌ |
| 2 | Browse departments & about info | Home / About Us | ❌ |
| 3 | Send contact message | Home page (MessageForm) | ❌ |
| 4 | Register account | Register page | ❌ |
| 5 | Login | Login page | ❌ |
| 6 | View dashboard with stats | PatientDashboard | ✅ |
| 7 | Book appointment (dept, condition, date, address) | Appointment page | ✅ |
| 8 | Track appointment status progression | PatientDashboard | ✅ |
| 9 | View assigned doctor details (avatar, contact) | PatientDashboard (expanded card) | ✅ |
| 10 | Logout | Navbar | ✅ |

**Departments Available for Booking:**

| # | Department | Icon |
|---|-----------|------|
| 1 | Pediatrics | 👶 |
| 2 | Orthopedics | 🦴 |
| 3 | Cardiology | ❤️ |
| 4 | Neurology | 🧠 |
| 5 | Oncology | 🔬 |
| 6 | Radiology | 📡 |
| 7 | Physical Therapy | 🏃 |
| 8 | Dermatology | 🧴 |
| 9 | ENT | 👂 |
