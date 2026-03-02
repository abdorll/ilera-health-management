# Frontend-Admin — Ìlera Health & Wellness Administration Dashboard

## 2.3 System Architecture

The Admin Dashboard is a **React.js Single-Page Application (SPA)** that serves as the administrative interface for the Ìlera Health & Wellness Management System. It communicates with the backend REST API via Axios HTTP requests with cookie-based authentication.

```
┌───────────────────────────────────────────────────────────────────────────────┐
│                    ADMIN DASHBOARD — PRESENTATION TIER                        │
│                                                                               │
│   ┌───────────────────────────────────────────────────────────────────┐      │
│   │                    React.js SPA (Vite Build)                      │      │
│   │                    Base Path: /admin/                              │      │
│   │                                                                   │      │
│   │  ┌─────────────────────────────────────────────────────────┐     │      │
│   │  │              Context API (Global State)                  │     │      │
│   │  │  ┌─────────────────┐  ┌──────────────────────────┐     │     │      │
│   │  │  │ isAuthenticated │  │ user (admin object)       │     │     │      │
│   │  │  │ (boolean)       │  │ {firstName, lastName,     │     │     │      │
│   │  │  │                 │  │  email, role, ...}        │     │     │      │
│   │  │  └─────────────────┘  └──────────────────────────┘     │     │      │
│   │  └─────────────────────────────────────────────────────────┘     │      │
│   │                                                                   │      │
│   │  ┌─────────────────────────────────────────────────────────┐     │      │
│   │  │              React Router (BrowserRouter)                │     │      │
│   │  │                                                          │     │      │
│   │  │  /           → Dashboard (appointment overview)          │     │      │
│   │  │  /login      → Login (admin credentials)                 │     │      │
│   │  │  /doctor/addnew → AddNewDoctor (register doctor)         │     │      │
│   │  │  /admin/addnew  → AddNewAdmin (principal only)           │     │      │
│   │  │  /admins     → ManageAdmins (principal only)             │     │      │
│   │  │  /messages   → Messages (view patient messages)          │     │      │
│   │  │  /doctors    → Doctors (view/edit/delete doctors)        │     │      │
│   │  └─────────────────────────────────────────────────────────┘     │      │
│   │                                                                   │      │
│   │  ┌─────────────────────────────────────────────────────────┐     │      │
│   │  │              Sidebar Navigation                          │     │      │
│   │  │  Home │ Doctors │ Add Admin* │ Manage Admins* │         │     │      │
│   │  │  Add Doctor │ Messages │ Logout                          │     │      │
│   │  │  (* = Principal Admin only, checked via email match)     │     │      │
│   │  └─────────────────────────────────────────────────────────┘     │      │
│   └───────────────────────────────────────────────────────────────────┘      │
│                             │                                                 │
│                             │ Axios HTTP (withCredentials: true)               │
│                             │ Cookie: adminToken                              │
│                             ▼                                                 │
│   ┌───────────────────────────────────────────────────────────────────┐      │
│   │              Backend REST API (Express.js)                        │      │
│   │              VITE_API_URL environment variable                    │      │
│   │                                                                   │      │
│   │  Consumed Endpoints:                                              │      │
│   │  ├─ POST   /api/v1/user/login                                    │      │
│   │  ├─ GET    /api/v1/user/admin/me                                 │      │
│   │  ├─ GET    /api/v1/user/admin/logout                             │      │
│   │  ├─ GET    /api/v1/user/doctors                                  │      │
│   │  ├─ GET    /api/v1/user/admins                                   │      │
│   │  ├─ POST   /api/v1/user/doctor/addnew                           │      │
│   │  ├─ POST   /api/v1/user/admin/addnew                            │      │
│   │  ├─ PUT    /api/v1/user/doctor/edit/:id                         │      │
│   │  ├─ DELETE /api/v1/user/doctor/delete/:id                       │      │
│   │  ├─ PUT    /api/v1/user/admin/edit/:id                          │      │
│   │  ├─ DELETE /api/v1/user/admin/delete/:id                        │      │
│   │  ├─ GET    /api/v1/appointment/getall                            │      │
│   │  ├─ PUT    /api/v1/appointment/assign                            │      │
│   │  ├─ GET    /api/v1/appointment/doctors/:department               │      │
│   │  └─ GET    /api/v1/message/getall                                │      │
│   └───────────────────────────────────────────────────────────────────┘      │
└───────────────────────────────────────────────────────────────────────────────┘
```

**Figure 2.1**: Admin Dashboard Architecture within the Three-Tier System

### Component Interaction Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        Admin SPA Component Tree                         │
│                                                                         │
│  main.jsx                                                               │
│  └─ Context.Provider {isAuthenticated, user}                            │
│     └─ App.jsx                                                          │
│        ├─ useEffect → GET /user/admin/me → sets auth state              │
│        ├─ Sidebar.jsx                                                   │
│        │  ├─ Reads: isAuthenticated, user (from Context)                │
│        │  ├─ isPrincipal check: user.email === "admin@ilera.com"        │
│        │  ├─ Conditional nav items (Add Admin, Manage Admins)           │
│        │  └─ handleLogout → GET /user/admin/logout                      │
│        │                                                                │
│        └─ Routes                                                        │
│           ├─ "/" → Dashboard.jsx                                        │
│           │  ├─ Reads: isAuthenticated, user (from Context)             │
│           │  ├─ useEffect → GET /appointment/getall                     │
│           │  ├─ Filters: Pending, Rejected → "Needs Action" table       │
│           │  ├─ openAssignPanel → GET /appointment/doctors/:dept        │
│           │  ├─ handleAssignDoctor → PUT /appointment/assign            │
│           │  └─ Renders: stats cards, needs-action table, all-appts    │
│           │                                                             │
│           ├─ "/login" → Login.jsx                                       │
│           │  └─ handleLogin → POST /user/login {role: "Admin"}          │
│           │                                                             │
│           ├─ "/doctor/addnew" → AddNewDoctor.jsx                        │
│           │  ├─ Form: name, email, phone, NIN, DOB, gender, dept, pwd  │
│           │  ├─ Avatar upload with preview                              │
│           │  └─ addNewDoctor → POST /user/doctor/addnew (FormData)      │
│           │                                                             │
│           ├─ "/admin/addnew" → AddNewAdmin.jsx (Principal only)         │
│           │  ├─ Form: name, email, phone, NIN, DOB, gender, password   │
│           │  └─ addNewAdmin → POST /user/admin/addnew                   │
│           │                                                             │
│           ├─ "/admins" → ManageAdmins.jsx (Principal only)              │
│           │  ├─ useEffect → GET /user/admins                            │
│           │  ├─ Inline edit form (firstName, lastName, email, phone)    │
│           │  ├─ saveEdit → PUT /user/admin/edit/:id                     │
│           │  ├─ handleDelete → DELETE /user/admin/delete/:id            │
│           │  └─ Principal admin card is non-editable/non-deletable      │
│           │                                                             │
│           ├─ "/messages" → Messages.jsx                                 │
│           │  └─ useEffect → GET /message/getall                         │
│           │                                                             │
│           └─ "/doctors" → Doctors.jsx                                   │
│              ├─ useEffect → GET /user/doctors                           │
│              ├─ Inline edit form (name, email, phone, department)       │
│              ├─ saveEdit → PUT /user/doctor/edit/:id (Principal only)   │
│              └─ handleDelete → DELETE /user/doctor/delete/:id           │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

**Figure 2.2**: Admin Dashboard Component Interaction and Data Flow

---

## 2.4 System Models

### 2.4.1 Entity-Relationship Diagram (ERD)

The Admin Dashboard interacts with all three database entities:

```
┌──────────────────────────────────────┐
│              USER                     │
├──────────────────────────────────────┤
│ _id          : ObjectId (PK)         │
│ firstName    : String                │
│ lastName     : String                │
│ email        : String                │
│ phone        : String                │
│ nin          : String                │
│ dob          : Date                  │
│ gender       : Enum                  │
│ password     : String (hashed)       │
│ role         : Enum [Admin, Patient, │
│                      Doctor]         │
│ doctrDptmnt  : String (Doctor only)  │
│ doctrAvatar  : {public_id, url}      │
├──────────────────────────────────────┤
│ Admin Dashboard Operations:           │
│  • GET all doctors (role=Doctor)      │
│  • GET all admins (role=Admin)        │
│  • POST new doctor (with avatar)      │
│  • POST new admin                     │
│  • PUT edit doctor/admin              │
│  • DELETE remove doctor/admin         │
└───────────┬──────────────────────────┘
            │ 1:N (Doctor → Appointments)
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
│ doctorId         : ObjectId (FK)     │
│ hasVisited       : Boolean           │
│ status           : Enum              │
├──────────────────────────────────────┤
│ Admin Dashboard Operations:           │
│  • GET all appointments               │
│  • PUT assign doctor (→ "Assigned")   │
│  • GET doctors by department           │
│  • View status across all 5 states    │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│            MESSAGE                    │
├──────────────────────────────────────┤
│ _id       : ObjectId                 │
│ firstName : String                   │
│ lastName  : String                   │
│ email     : String                   │
│ phone     : String                   │
│ message   : String                   │
├──────────────────────────────────────┤
│ Admin Dashboard Operations:           │
│  • GET all messages (read-only)       │
└──────────────────────────────────────┘
```

**Figure 2.3**: ERD from the Admin Dashboard Perspective

### 2.4.2 Use Case Diagram

```
                         ┌──────────────────────────────────────────────────────┐
                         │          Admin Dashboard Use Cases                    │
                         │                                                      │
  ┌──────────┐           │   ┌────────────────────────────────────┐            │
  │ Principal│───────────┼──→│ Login with Admin Credentials        │            │
  │  Admin   │           │   └────────────────────────────────────┘            │
  │ (admin@  │           │   ┌────────────────────────────────────┐            │
  │ ilera.   │───────────┼──→│ View Dashboard (all appointments)  │            │
  │ com)     │           │   │ • Total count, needs-action count  │            │
  │          │           │   │ • Status: Pending/Assigned/Accepted│            │
  │          │           │   │   /Rejected/Completed              │            │
  │          │           │   └────────────────────────────────────┘            │
  │          │           │   ┌────────────────────────────────────┐            │
  │          │───────────┼──→│ Assign Doctor to Appointment       │            │
  │          │           │   │ • Select from dept-filtered list   │            │
  │          │           │   │ • Reassign after rejection         │            │
  │          │           │   └────────────────────────────────────┘            │
  │          │           │   ┌────────────────────────────────────┐            │
  │          │───────────┼──→│ Register New Doctor                │            │
  │          │           │   │ • Upload avatar (Cloudinary)       │            │
  │          │           │   │ • Sends welcome email              │            │
  │          │           │   └────────────────────────────────────┘            │
  │          │           │   ┌────────────────────────────────────┐            │
  │          │───────────┼──→│ Edit / Remove Doctors              │ ◀ Principal│
  │          │           │   └────────────────────────────────────┘    Only    │
  │          │           │   ┌────────────────────────────────────┐            │
  │          │───────────┼──→│ Add New Admin                      │ ◀ Principal│
  │          │           │   │ • Sends invitation email           │    Only    │
  │          │           │   └────────────────────────────────────┘            │
  │          │           │   ┌────────────────────────────────────┐            │
  │          │───────────┼──→│ Edit / Remove Admins               │ ◀ Principal│
  │          │           │   │ • Cannot remove principal admin    │    Only    │
  │          │           │   └────────────────────────────────────┘            │
  │          │           │   ┌────────────────────────────────────┐            │
  │          │───────────┼──→│ View Patient Messages              │            │
  │          │           │   └────────────────────────────────────┘            │
  │          │           │   ┌────────────────────────────────────┐            │
  │          │───────────┼──→│ View All Registered Doctors        │            │
  │          │           │   └────────────────────────────────────┘            │
  │          │           │   ┌────────────────────────────────────┐            │
  │          │───────────┼──→│ Logout                             │            │
  └──────────┘           │   └────────────────────────────────────┘            │
                         │                                                      │
  ┌──────────┐           │   ┌────────────────────────────────────┐            │
  │ Secondary│───────────┼──→│ Login with Admin Credentials        │            │
  │  Admin   │           │   └────────────────────────────────────┘            │
  │          │           │   ┌────────────────────────────────────┐            │
  │          │───────────┼──→│ View Dashboard (all appointments)  │            │
  │          │           │   └────────────────────────────────────┘            │
  │          │           │   ┌────────────────────────────────────┐            │
  │          │───────────┼──→│ Assign Doctor to Appointment       │            │
  │          │           │   └────────────────────────────────────┘            │
  │          │           │   ┌────────────────────────────────────┐            │
  │          │───────────┼──→│ Register New Doctor                │            │
  │          │           │   └────────────────────────────────────┘            │
  │          │           │   ┌────────────────────────────────────┐            │
  │          │───────────┼──→│ View All Doctors (read-only)       │            │
  │          │           │   └────────────────────────────────────┘            │
  │          │           │   ┌────────────────────────────────────┐            │
  │          │───────────┼──→│ View Patient Messages              │            │
  │          │           │   └────────────────────────────────────┘            │
  │          │           │   ┌────────────────────────────────────┐            │
  │          │───────────┼──→│ Logout                             │            │
  └──────────┘           │   └────────────────────────────────────┘            │
                         └──────────────────────────────────────────────────────┘
```

**Figure 2.4**: Admin Dashboard Use Case Diagram

**Principal vs Secondary Admin Permissions:**

| Capability | Principal Admin | Secondary Admin |
|------------|:-:|:-:|
| Login / Logout | ✅ | ✅ |
| View Dashboard & Appointments | ✅ | ✅ |
| Assign Doctor to Appointment | ✅ | ✅ |
| Register New Doctor | ✅ | ✅ |
| View All Doctors | ✅ | ✅ |
| Edit / Remove Doctors | ✅ | ❌ |
| Add New Admin | ✅ | ❌ |
| Manage (Edit/Remove) Admins | ✅ | ❌ |
| View Patient Messages | ✅ | ✅ |
