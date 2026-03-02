# Frontend-Doctor — Ìlera Health & Wellness Doctor Portal

## 2.3 System Architecture

The Doctor Portal is a **React.js Single-Page Application (SPA)** that provides doctors with a dedicated interface to manage their assigned appointments, respond to admin assignments, self-assign unassigned department appointments, and mark visits as completed.

```
┌───────────────────────────────────────────────────────────────────────────────┐
│                    DOCTOR PORTAL — PRESENTATION TIER                          │
│                                                                               │
│   ┌───────────────────────────────────────────────────────────────────┐      │
│   │                    React.js SPA (Vite Build)                      │      │
│   │                    Base Path: /doctors/                            │      │
│   │                    Dev Port: 5176                                  │      │
│   │                                                                   │      │
│   │  ┌─────────────────────────────────────────────────────────┐     │      │
│   │  │              Context API (Global State)                  │     │      │
│   │  │  ┌─────────────────┐  ┌──────────────────────────┐     │     │      │
│   │  │  │ isAuthenticated │  │ user (doctor object)      │     │     │      │
│   │  │  │ (boolean)       │  │ {firstName, lastName,     │     │     │      │
│   │  │  │                 │  │  email, doctrDptmnt, ...} │     │     │      │
│   │  │  └─────────────────┘  └──────────────────────────┘     │     │      │
│   │  └─────────────────────────────────────────────────────────┘     │      │
│   │                                                                   │      │
│   │  ┌─────────────────────────────────────────────────────────┐     │      │
│   │  │              React Router (BrowserRouter)                │     │      │
│   │  │                                                          │     │      │
│   │  │  /           → Dashboard (if authenticated)              │     │      │
│   │  │                 else → redirect to /login                │     │      │
│   │  │  /login      → Login (if not authenticated)              │     │      │
│   │  │                 else → redirect to /                     │     │      │
│   │  └─────────────────────────────────────────────────────────┘     │      │
│   │                                                                   │      │
│   │  ┌─────────────────────────────────────────────────────────┐     │      │
│   │  │              Dashboard Layout                            │     │      │
│   │  │  ┌─────────────────────────────────────────────────┐    │     │      │
│   │  │  │ Navbar: Doctor name, department, logout button   │    │     │      │
│   │  │  └─────────────────────────────────────────────────┘    │     │      │
│   │  │  ┌─────────────────────────────────────────────────┐    │     │      │
│   │  │  │ Stats: Awaiting | Active | Completed | Unassigned│    │     │      │
│   │  │  └─────────────────────────────────────────────────┘    │     │      │
│   │  │  ┌─────────────────────────────────────────────────┐    │     │      │
│   │  │  │ Tabs: "My Patients" | "Unassigned"              │    │     │      │
│   │  │  └─────────────────────────────────────────────────┘    │     │      │
│   │  └─────────────────────────────────────────────────────────┘     │      │
│   └───────────────────────────────────────────────────────────────────┘      │
│                             │                                                 │
│                             │ Axios HTTP (withCredentials: true)               │
│                             │ Cookie: doctorToken                             │
│                             ▼                                                 │
│   ┌───────────────────────────────────────────────────────────────────┐      │
│   │              Backend REST API (Express.js)                        │      │
│   │              VITE_API_URL environment variable                    │      │
│   │                                                                   │      │
│   │  Consumed Endpoints:                                              │      │
│   │  ├─ POST   /api/v1/user/login {role: "Doctor"}                   │      │
│   │  ├─ GET    /api/v1/user/doctor/me                                │      │
│   │  ├─ GET    /api/v1/user/doctor/logout                            │      │
│   │  ├─ GET    /api/v1/appointment/doctor/mypatients                 │      │
│   │  ├─ GET    /api/v1/appointment/doctor/unassigned                 │      │
│   │  ├─ PUT    /api/v1/appointment/doctor/selfassign                 │      │
│   │  ├─ PUT    /api/v1/appointment/doctor/respond                    │      │
│   │  └─ PUT    /api/v1/appointment/doctor/complete                   │      │
│   └───────────────────────────────────────────────────────────────────┘      │
└───────────────────────────────────────────────────────────────────────────────┘
```

**Figure 2.1**: Doctor Portal Architecture within the Three-Tier System

### Component Interaction Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     Doctor SPA Component Tree                           │
│                                                                         │
│  main.jsx                                                               │
│  └─ Context.Provider {isAuthenticated, user}                            │
│     └─ App.jsx                                                          │
│        ├─ useEffect → GET /user/doctor/me → sets auth state             │
│        │                                                                │
│        └─ Routes                                                        │
│           ├─ "/" → Dashboard.jsx (if authenticated)                     │
│           │  │                                                          │
│           │  ├─ Navbar Section                                          │
│           │  │  ├─ Displays: Dr. {firstName} {lastName}                 │
│           │  │  ├─ Displays: {doctrDptmnt} department badge             │
│           │  │  └─ handleLogout → GET /user/doctor/logout               │
│           │  │                                                          │
│           │  ├─ Data Fetching (parallel via Promise.all)                │
│           │  │  ├─ GET /appointment/doctor/mypatients                   │
│           │  │  │   → myAppointments[] (Assigned + Accepted + Completed)│
│           │  │  └─ GET /appointment/doctor/unassigned                   │
│           │  │      → unassignedAppointments[] (Pending, same dept)     │
│           │  │                                                          │
│           │  ├─ Stats Cards                                             │
│           │  │  ├─ Awaiting Response: myAppts.filter(Assigned).length   │
│           │  │  ├─ Active Patients:   myAppts.filter(Accepted).length   │
│           │  │  ├─ Completed:         myAppts.filter(Completed).length  │
│           │  │  └─ Unassigned in Dept: unassignedAppointments.length    │
│           │  │                                                          │
│           │  ├─ Tab: "My Patients"                                      │
│           │  │  ├─ For each appointment card:                           │
│           │  │  │  ├─ Patient info (name, email, phone)                 │
│           │  │  │  ├─ Condition, date, address                          │
│           │  │  │  ├─ Status badge (Assigned/Accepted/Completed)        │
│           │  │  │  │                                                    │
│           │  │  │  ├─ If status === "Assigned":                         │
│           │  │  │  │  ├─ [Accept] → PUT /doctor/respond                 │
│           │  │  │  │  │              {appointmentId, response:"Accepted"}│
│           │  │  │  │  └─ [Decline] → PUT /doctor/respond                │
│           │  │  │  │                 {appointmentId, response:"Rejected"}│
│           │  │  │  │                                                    │
│           │  │  │  └─ If status === "Accepted":                         │
│           │  │  │     └─ [Mark Completed] → PUT /doctor/complete        │
│           │  │  │                           {appointmentId}             │
│           │  │  └─ Empty state: "No patients assigned yet"              │
│           │  │                                                          │
│           │  └─ Tab: "Unassigned"                                       │
│           │     ├─ Shows Pending appointments in doctor's department    │
│           │     ├─ For each appointment card:                           │
│           │     │  ├─ Patient info, condition, date, address            │
│           │     │  └─ [Take This Patient] → PUT /doctor/selfassign     │
│           │     │                           {appointmentId}             │
│           │     └─ Empty state: "All caught up!"                        │
│           │                                                             │
│           └─ "/login" → Login.jsx (if not authenticated)                │
│              └─ handleLogin → POST /user/login                          │
│                 {email, password, confirmPassword: password,             │
│                  role: "Doctor"}                                         │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

**Figure 2.2**: Doctor Portal Component Interaction and Data Flow

---

## 2.4 System Models

### 2.4.1 Entity-Relationship Diagram (ERD)

The Doctor Portal interacts with the User and Appointment entities:

```
┌──────────────────────────────────────┐
│              USER (Doctor)            │
├──────────────────────────────────────┤
│ _id          : ObjectId (PK)         │
│ firstName    : String                │
│ lastName     : String                │
│ email        : String                │
│ phone        : String                │
│ role         : "Doctor"              │
│ doctrDptmnt  : String               │
│ doctrAvatar  : {public_id, url}      │
├──────────────────────────────────────┤
│ Doctor Portal Operations:             │
│  • GET /user/doctor/me (own profile) │
│  • Login / Logout                     │
└───────────┬──────────────────────────┘
            │
            │ 0:N (Doctor → Appointments via doctorId)
            ▼
┌──────────────────────────────────────┐
│           APPOINTMENT                 │
├──────────────────────────────────────┤
│ _id              : ObjectId          │
│ patientId        : ObjectId (FK)     │
│ patientFirstName : String            │
│ patientLastName  : String            │
│ patientEmail     : String            │
│ patientPhone     : String            │
│ department       : String            │
│ condition        : String            │
│ appointment_date : String            │
│ address          : String            │
│ doctor           : {firstName,       │
│                    lastName}         │
│ doctorId         : ObjectId (FK)     │──→ References this Doctor
│ hasVisited       : Boolean           │
│ status           : Enum              │
├──────────────────────────────────────┤
│ Doctor Portal Operations:             │
│  • GET mypatients (doctorId = me)    │
│  • GET unassigned (dept match,       │
│    doctorId = null)                  │
│  • PUT selfassign (Pending→Accepted) │
│  • PUT respond (Assigned→Accepted    │
│    or Assigned→Rejected)             │
│  • PUT complete (Accepted→Completed) │
└──────────────────────────────────────┘

Doctor's Appointment State Transitions:
───────────────────────────────────────

  From "My Patients" tab:
  ┌──────────┐  Doctor accepts   ┌──────────┐  Doctor completes  ┌───────────┐
  │ Assigned │ ────────────────→ │ Accepted │ ────────────────→ │ Completed │
  └──────────┘                   └──────────┘                   └───────────┘
       │
       │ Doctor declines
       ▼
  ┌──────────┐
  │ Rejected │  (returned to admin for reassignment)
  └──────────┘

  From "Unassigned" tab:
  ┌─────────┐  Doctor self-assigns  ┌──────────┐
  │ Pending │ ────────────────────→ │ Accepted │
  └─────────┘                       └──────────┘
```

**Figure 2.3**: ERD from the Doctor Portal Perspective

### 2.4.2 Use Case Diagram

```
                         ┌──────────────────────────────────────────────────────┐
                         │          Doctor Portal Use Cases                      │
                         │                                                      │
  ┌──────────┐           │   ┌────────────────────────────────────┐            │
  │          │───────────┼──→│ Login with Doctor Credentials       │            │
  │          │           │   │ (credentials sent via welcome email)│            │
  │          │           │   └────────────────────────────────────┘            │
  │          │           │                                                      │
  │          │           │   ┌────────────────────────────────────┐            │
  │          │───────────┼──→│ View My Patients (assigned appts)  │            │
  │          │           │   │ • Assigned: awaiting response       │            │
  │          │           │   │ • Accepted: active patients         │            │
  │          │           │   │ • Completed: past visits            │            │
  │          │           │   └────────────────────────────────────┘            │
  │          │           │                                                      │
  │  Doctor  │           │   ┌────────────────────────────────────┐            │
  │          │───────────┼──→│ Accept Admin Assignment             │            │
  │          │           │   │ (Assigned → Accepted)               │            │
  │          │           │   └────────────────────────────────────┘            │
  │          │           │                                                      │
  │          │           │   ┌────────────────────────────────────┐            │
  │          │───────────┼──→│ Decline Admin Assignment            │            │
  │          │           │   │ (Assigned → Rejected)               │            │
  │          │           │   │ Returns to admin for reassignment   │            │
  │          │           │   └────────────────────────────────────┘            │
  │          │           │                                                      │
  │          │           │   ┌────────────────────────────────────┐            │
  │          │───────────┼──→│ View Unassigned Dept Appointments  │            │
  │          │           │   │ (Pending appts in same department) │            │
  │          │           │   └────────────────────────────────────┘            │
  │          │           │                                                      │
  │          │           │   ┌────────────────────────────────────┐            │
  │          │───────────┼──→│ Self-Assign to Appointment          │            │
  │          │           │   │ (Pending → Accepted, same dept)    │            │
  │          │           │   └────────────────────────────────────┘            │
  │          │           │                                                      │
  │          │           │   ┌────────────────────────────────────┐            │
  │          │───────────┼──→│ Mark Appointment Completed          │            │
  │          │           │   │ (Accepted → Completed)              │            │
  │          │           │   │ Sets hasVisited = true              │            │
  │          │           │   └────────────────────────────────────┘            │
  │          │           │                                                      │
  │          │           │   ┌────────────────────────────────────┐            │
  │          │───────────┼──→│ View Dashboard Statistics           │            │
  │          │           │   │ • Awaiting response count           │            │
  │          │           │   │ • Active patients count             │            │
  │          │           │   │ • Completed visits count            │            │
  │          │           │   │ • Unassigned in dept count          │            │
  │          │           │   └────────────────────────────────────┘            │
  │          │           │                                                      │
  │          │           │   ┌────────────────────────────────────┐            │
  │          │───────────┼──→│ Logout                              │            │
  └──────────┘           │   └────────────────────────────────────┘            │
                         └──────────────────────────────────────────────────────┘
```

**Figure 2.4**: Doctor Portal Use Case Diagram

**Doctor Workflow Summary:**

| Step | Action | Status Change | Trigger |
|------|--------|---------------|---------|
| 1 | Admin assigns doctor to appointment | Pending → Assigned | Admin Dashboard |
| 2a | Doctor accepts assignment | Assigned → Accepted | "Accept" button |
| 2b | Doctor declines assignment | Assigned → Rejected | "Decline" button |
| 3 | Doctor marks visit completed | Accepted → Completed | "Mark Completed" button |
| Alt | Doctor self-assigns from unassigned pool | Pending → Accepted | "Take This Patient" button |
