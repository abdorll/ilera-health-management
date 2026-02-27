
---

<div align="center">

# ÌLERA HEALTH & WELLNESS MANAGEMENT SYSTEM

## A Full-Stack Web-Based Information System for Hospital Operations Management

---

### CSC 419 — System Design and Architecture

### Final Semester Project Report

---

**Group 13**

| S/N | Name | Matric Number |
|-----|------|---------------|
| 1 | Omodara Seyitan Dunamis | 210805170 |
| 2 | Adebisi Olayinka Ayoola | 210805110 |
| 3 | Adesanmi Demilade | 230805533 |
| 4 | Opadeji Abdullah Ololade | 210805095 |
| 5 | Adalemo Al-Amin Teniola | 210805127 |
| 6 | Meduye Olaotan Gabriel | 210805037 |
| 7 | Obaji Elisha | 210805169 |
| 8 | Ifegbesan Tanitoluwa Samuel | 210805087 |
| 9 | Akinwunmi Oluwasegun Samson | 230805503 |
| 10 | Ajao Basit Omotoyosi | 210805075 |

---

**February 2026**

</div>

---

<div style="page-break-after: always;"></div>

## Abstract

The Ìlera Health & Wellness Management System is a comprehensive, full-stack web-based information system designed to streamline and automate the core operational workflows of a modern hospital. The system addresses key challenges in hospital administration, including patient registration, appointment scheduling, doctor management, role-based administration, and inter-departmental communication. Built upon a three-tier client-server architecture, the system comprises a RESTful API backend developed with Node.js and Express.js, a NoSQL database layer powered by MongoDB, and three distinct React.js single-page application (SPA) frontends — an administrative dashboard, a patient-facing portal, and a doctor portal. The system implements role-based access control (RBAC) supporting four distinct user levels: Principal Administrator, Secondary Administrator, Doctor, and Patient. Authentication is achieved through JSON Web Tokens (JWT) transmitted via HTTP-only cookies with separate tokens for each role, ensuring secure, stateless session management. The system features a five-state appointment workflow (Pending → Assigned → Accepted/Rejected/Completed) where administrators assign doctors to patient appointment requests, and doctors can accept, reject, or self-assign appointments within their departments. Automated email notifications are sent via Nodemailer using Gmail SMTP for doctor onboarding, admin invitations, and email change alerts. Cloud-based image storage is integrated via Cloudinary for doctor profile management. The system supports nine hospital departments and provides descriptive real-time appointment status tracking across all three portals. This report presents the complete system design, architectural decisions, data models, API design, implementation details, and the results of system testing.

---

<div style="page-break-after: always;"></div>

## 1. Introduction

### 1.1 Background to the Study

The healthcare industry is one of the most critical sectors in any society, directly impacting the well-being and quality of life of millions of people. Effective hospital management requires the coordination of multiple complex processes including patient intake, medical staff scheduling, appointment management, medical record keeping, and administrative communication. Traditionally, many of these processes have been handled through manual, paper-based systems that are prone to errors, inefficiencies, delays, and data loss.

With the rapid advancement of information technology, hospitals and healthcare institutions around the world are increasingly adopting digital solutions to manage their operations. Hospital Management Systems (HMS) have emerged as vital tools that integrate various hospital functions into a unified platform, reducing human error, improving data accessibility, enhancing patient experience, and increasing overall operational efficiency.

Modern web technologies, particularly the JavaScript ecosystem, have made it possible to develop robust, scalable, and real-time web applications that can serve as effective hospital management platforms. The MERN stack (MongoDB, Express.js, React.js, Node.js) has gained significant popularity for building full-stack web applications due to its use of a single programming language (JavaScript) across the entire stack, its non-blocking I/O architecture, and the availability of a rich ecosystem of open-source libraries and tools.

### 1.2 Statement of the Problem

Many hospitals, especially in developing regions such as Nigeria, still rely on manual processes for managing patient records, scheduling appointments, and coordinating between departments. These manual systems present several challenges:

1. **Data Redundancy and Inconsistency**: Patient information is often duplicated across multiple registers and forms, leading to inconsistencies and errors.
2. **Inefficient Appointment Scheduling**: Patients often have to physically visit the hospital to book appointments, and there is no structured way for administrators to assign available doctors.
3. **Poor Communication Channels**: There is often no structured channel for patients to communicate with hospital administration, resulting in delayed responses and poor patient satisfaction.
4. **Lack of Centralised Doctor Management**: Managing doctor profiles, department assignments, and availability is cumbersome without a centralised digital system.
5. **No Doctor-Facing Portal**: Doctors typically lack a digital interface to view and manage their assigned appointments.
6. **Security Concerns**: Paper-based records are vulnerable to loss, unauthorized access, and damage.
7. **Absence of Role-Based Access**: Without proper access control, sensitive patient data and administrative functions may be accessed by unauthorized personnel.
8. **No Automated Notifications**: Staff onboarding and credential sharing is done manually, prone to delays and errors.

### 1.3 Aim and Objectives

**Aim:** To design and implement a web-based Hospital Management System that automates core hospital operations, provides role-based access to system functionalities, and improves the efficiency of patient-hospital interactions.

**Objectives:**

1. To design a three-tier client-server architecture that separates the presentation, business logic, and data persistence layers.
2. To implement a secure authentication and authorization system using JSON Web Tokens (JWT) with role-based access control (RBAC) for Principal Administrators, Secondary Administrators, Doctors, and Patients.
3. To develop a RESTful API backend that exposes endpoints for user management, appointment management, doctor assignment, and messaging functionalities.
4. To develop three separate frontend applications — an administrative dashboard, a patient portal, and a doctor portal — each tailored to the needs of its target user group.
5. To implement a five-state appointment workflow (Pending → Assigned → Accepted → Rejected → Completed) with admin-driven doctor assignment.
6. To implement a NoSQL database schema using MongoDB that efficiently models the relationships between users, appointments, and messages.
7. To integrate cloud-based media storage (Cloudinary) for managing doctor profile images.
8. To implement automated email notifications using Nodemailer for staff onboarding and account change alerts.

### 1.4 Scope of Study

This project covers the following functional areas of hospital management:

- **User Management**: Registration, authentication, and role management for four user levels (Principal Admin, Secondary Admin, Patient, Doctor).
- **Appointment Management**: End-to-end appointment booking by patients, admin-driven doctor assignment, doctor acceptance/rejection, appointment completion tracking, and deletion.
- **Doctor Portal**: Dedicated interface for doctors to view assigned appointments, respond to assignments, self-assign to department appointments, and mark visits as completed.
- **Messaging System**: One-way messaging from patients/visitors to hospital administration.
- **Doctor Management**: Doctor profile registration with department assignment, avatar upload, email-based onboarding, and CRUD operations by the principal admin.
- **Admin Management**: Principal admin can add, edit, and remove secondary admins; secondary admins can add doctors and assign appointments.
- **Email Notification Service**: Automated emails for doctor/admin onboarding and email change alerts.
- **Administrative Dashboard**: Overview of appointments with descriptive status tracking, department listing, doctor assignment controls, and administrative management.

The system does **not** cover the following areas (which are beyond the scope of this project): electronic medical records (EMR), billing and payments, pharmacy management, laboratory information systems, and advanced scheduling algorithms.

### 1.5 Significance of the Study

This project is significant for several reasons:

1. **Practical Application of System Design Principles**: The project demonstrates the practical application of system design and architecture concepts studied in CSC 419, including architectural patterns, component interaction, system modelling, and software development lifecycle methodologies.
2. **Full-Stack Development Competence**: The project provides hands-on experience with modern full-stack web development using the MERN stack, covering frontend, backend, database design, API design, authentication, email integration, and deployment.
3. **Healthcare Sector Contribution**: The system serves as a prototype that can be extended and adapted for use in real healthcare institutions, contributing to the digital transformation of the healthcare sector in Nigeria.
4. **Role-Based Security Architecture**: The implementation of JWT-based authentication with four distinct access tiers and principal/secondary admin hierarchy demonstrates advanced security architecture concepts applicable across industries.
5. **Multi-Portal Architecture**: The development of three distinct frontend applications demonstrates modern micro-frontend design principles and user-centred design for different stakeholder groups.

---

<div style="page-break-after: always;"></div>

## 2. Methodology

This section details the system requirements, architectural design, system models, and the software development methodology adopted in the design and implementation of the Ìlera Health & Wellness Management System.

### 2.1 Software Development Life Cycle (SDLC)

The project adopted the **Agile Software Development Methodology** with elements of the iterative model. This approach was chosen because:

- It allows for incremental development and delivery of system components.
- It supports continuous feedback and iterative refinement.
- It is well-suited for projects with evolving requirements.
- It enables parallel development of the backend and multiple frontend components.

The development was organized into the following sprints:

| Sprint | Duration | Deliverables |
|--------|----------|-------------|
| Sprint 1 | Week 1–2 | Requirements gathering, system design, data modelling |
| Sprint 2 | Week 3–5 | Backend API development (User, Appointment, Message modules) |
| Sprint 3 | Week 6–7 | Frontend development (Patient Portal and Admin Dashboard) |
| Sprint 4 | Week 8–9 | Doctor Portal development, email notification service, admin role hierarchy |
| Sprint 5 | Week 10 | Integration testing, UI polish, bug fixing |

### 2.2 System Requirements

#### 2.2.1 Functional Requirements

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-01 | The system shall allow patients to register with personal details (name, email, phone, NIN, DOB, gender). | High |
| FR-02 | The system shall authenticate users via email, password, and role selection. | High |
| FR-03 | The system shall support four distinct user levels: Principal Admin, Secondary Admin, Patient, and Doctor. | High |
| FR-04 | The principal admin shall be able to add, edit, and remove secondary admins. | High |
| FR-05 | Admins shall be able to register new doctors with profile photos, triggering an automated welcome email. | High |
| FR-06 | Patients shall be able to book appointments by selecting a department, describing their condition, and choosing a preferred date. | High |
| FR-07 | Admin users shall be able to view all appointments and assign doctors from the relevant department. | High |
| FR-08 | Doctors shall be able to view their assigned appointments and accept, reject, or mark them as completed. | High |
| FR-09 | Doctors shall be able to view unassigned appointments in their department and self-assign. | Medium |
| FR-10 | The appointment status shall follow a five-state workflow: Pending → Assigned → Accepted/Rejected/Completed. | High |
| FR-11 | Visitors/Patients shall be able to send messages to the hospital administration. | Medium |
| FR-12 | Admin users shall be able to view all received messages. | Medium |
| FR-13 | The system shall display a list of all registered doctors on the patient portal. | Medium |
| FR-14 | Automated email notifications shall be sent to doctors and admins upon registration. | High |
| FR-15 | Email change notifications shall be sent to both old and new addresses when an admin updates a user's email. | Medium |
| FR-16 | Users shall be able to log out, which clears their authentication token. | High |
| FR-17 | The principal admin shall be able to edit and delete doctor profiles. | High |

#### 2.2.2 Non-Functional Requirements

| ID | Requirement | Category |
|----|-------------|----------|
| NFR-01 | The system shall respond to API requests within 2 seconds under normal load. | Performance |
| NFR-02 | Passwords shall be hashed using bcrypt with a salt factor of 10 before storage. | Security |
| NFR-03 | Authentication tokens shall be stored in HTTP-only cookies to prevent XSS attacks. | Security |
| NFR-04 | The frontend shall be responsive and accessible on desktop and mobile devices. | Usability |
| NFR-05 | The system shall validate all user inputs on both client and server sides. | Reliability |
| NFR-06 | The system shall handle errors gracefully and return meaningful error messages. | Reliability |
| NFR-07 | Email sending shall precede user creation to prevent orphan records if the email service fails. | Reliability |
| NFR-08 | Buttons triggering email operations shall show loading spinners to prevent double submissions. | Usability |

### 2.3 System Architecture

The Ìlera Health & Wellness Management System follows a **Three-Tier Client-Server Architecture**, which separates the system into three logical layers:

```
┌───────────────────────────────────────────────────────────────────────────────┐
│                           PRESENTATION TIER                                   │
│                                                                               │
│   ┌──────────────────┐   ┌──────────────────┐   ┌──────────────────┐        │
│   │  Patient Portal  │   │ Admin Dashboard  │   │  Doctor Portal  │        │
│   │  (React.js SPA)  │   │  (React.js SPA)  │   │  (React.js SPA) │        │
│   │   Port: 5174     │   │   Port: 5173     │   │   Port: 5175    │        │
│   └────────┬─────────┘   └────────┬─────────┘   └────────┬────────┘        │
│            │ Axios (HTTP)         │ Axios (HTTP)          │ Axios (HTTP)     │
└────────────┼──────────────────────┼───────────────────────┼──────────────────┘
             │                      │                       │
             ▼                      ▼                       ▼
┌───────────────────────────────────────────────────────────────────────────────┐
│                           APPLICATION TIER                                    │
│                                                                               │
│   ┌───────────────────────────────────────────────────────────────────┐      │
│   │              Node.js + Express.js REST API (Port: 4000)          │      │
│   │                                                                   │      │
│   │  ┌──────────┐  ┌──────────────┐  ┌───────────────────────┐      │      │
│   │  │  Routes   │→│  Controllers │→│  Middlewares            │      │      │
│   │  └──────────┘  └──────────────┘  │  (Auth, Principal,     │      │      │
│   │                                   │   Error, AsyncWrap)    │      │      │
│   │  ┌──────────┐  ┌──────────┐     └───────────────────────┘      │      │
│   │  │ JWT Auth │  │ Bcrypt   │  ┌──────────┐  ┌────────────┐      │      │
│   │  │ (3 tokens│  │          │  │Cloudinary│  │ Nodemailer │      │      │
│   │  │  Admin,  │  │          │  │  (Images)│  │  (Emails)  │      │      │
│   │  │ Patient, │  └──────────┘  └──────────┘  └────────────┘      │      │
│   │  │ Doctor)  │                                                    │      │
│   │  └──────────┘                                                    │      │
│   └───────────────────────────────────────────────────────────────────┘      │
│                             │                                                 │
└─────────────────────────────┼─────────────────────────────────────────────────┘
                              │
                              ▼
┌───────────────────────────────────────────────────────────────────────────────┐
│                             DATA TIER                                         │
│                                                                               │
│   ┌───────────────────────────────────────────────────────────────────┐      │
│   │              MongoDB Atlas (Cloud NoSQL Database)                 │      │
│   │                                                                   │      │
│   │  ┌────────┐    ┌──────────────┐    ┌──────────┐                 │      │
│   │  │ Users  │    │ Appointments │    │ Messages │                 │      │
│   │  └────────┘    └──────────────┘    └──────────┘                 │      │
│   └───────────────────────────────────────────────────────────────────┘      │
│                                                                               │
│   ┌──────────────────────────────┐   ┌──────────────────────────────┐       │
│   │  Cloudinary (Cloud Storage)  │   │  Gmail SMTP (Email Service) │       │
│   │  Doctor Avatar Images        │   │  Nodemailer Transporter      │       │
│   └──────────────────────────────┘   └──────────────────────────────┘       │
└───────────────────────────────────────────────────────────────────────────────┘
```

**Figure 2.1**: Three-Tier Architecture of the Ìlera Health & Wellness Management System

#### 2.3.1 Architectural Pattern — Model-View-Controller (MVC)

The backend follows the **MVC (Model-View-Controller)** architectural pattern:

- **Model Layer**: Mongoose schemas (`userSchema.js`, `appointmentSchema.js`, `messageSchema.js`) define the data structure and validation rules, along with instance methods for password hashing and JWT generation.
- **Controller Layer**: Controller files (`userController.js`, `appointmentController.js`, `messageController.js`) contain the business logic for handling HTTP requests, including email dispatch logic.
- **View Layer**: In this REST API architecture, views are decoupled from the server. The three React.js frontends serve as the view layer, consuming the API endpoints.

#### 2.3.2 Component Interaction Diagram

```
┌──────────┐    HTTP Request     ┌──────────┐    Route Match    ┌──────────┐
│  Client  │ ──────────────────→ │  Router  │ ────────────────→ │Middleware│
│ (React)  │                     │  Layer   │                   │(Auth/RBAC│
└──────────┘                     └──────────┘                   └────┬─────┘
     ▲                                                               │
     │                                                               ▼
     │           HTTP Response   ┌──────────┐   DB Query/Result ┌──────────┐
     │ ◀──────────────────────── │Controller│ ◀────────────────→│  Model   │
     │                           │  Layer   │                   │(Mongoose)│
     │                           └────┬─────┘                   └────┬─────┘
     │                                │                              │
     │                                ▼                              ▼
     │                           ┌──────────┐                  ┌──────────┐
     │                           │Nodemailer│                  │ MongoDB  │
     │                           │ (Email)  │                  └──────────┘
     │                           └──────────┘
     │                                │
     │                                ▼
     │                           ┌──────────┐
     └───────────────────────────│Cloudinary│
                                 └──────────┘
```

**Figure 2.2**: Request-Response Lifecycle and Component Interaction

### 2.4 System Models

#### 2.4.1 Entity-Relationship Diagram (ERD)

```
┌──────────────────────────────┐
│           USER               │
├──────────────────────────────┤
│ _id        : ObjectId (PK)  │
│ firstName  : String          │
│ lastName   : String          │
│ email      : String (unique) │
│ phone      : String (11)     │
│ nin        : String (11)     │
│ dob        : Date            │
│ gender     : Enum            │
│ password   : String (hashed) │
│ role       : Enum            │
│ doctrDptmnt: String          │
│ doctrAvatar: {public_id,url} │
└──────────┬───────────────────┘
           │
           │ 1:N (as Doctor)
           │ 1:N (as Patient)
           ▼
┌──────────────────────────────┐         ┌──────────────────────────┐
│       APPOINTMENT            │         │        MESSAGE           │
├──────────────────────────────┤         ├──────────────────────────┤
│ _id              : ObjectId  │         │ _id       : ObjectId     │
│ patientFirstName : String    │         │ firstName : String       │
│ patientLastName  : String    │         │ lastName  : String       │
│ patientEmail     : String    │         │ email     : String       │
│ patientPhone     : String    │         │ phone     : String       │
│ department       : String    │         │ message   : String       │
│ condition        : String    │         └──────────────────────────┘
│ appointment_date : String    │
│ address          : String    │
│ doctor.firstName : String    │
│ doctor.lastName  : String    │
│ hasVisited       : Boolean   │
│ doctorId         : ObjectId  │──→ References USER (Doctor)
│ patientId        : ObjectId  │──→ References USER (Patient)
│ status           : Enum      │
│   (Pending | Assigned |      │
│    Accepted | Rejected |     │
│    Completed)                │
│ createdAt        : Date      │
│ updatedAt        : Date      │
└──────────────────────────────┘
```

**Figure 2.3**: Entity-Relationship Diagram

#### 2.4.2 Use Case Diagram

```
                           ┌──────────────────────────────────────────────────┐
                           │        Ìlera Health & Wellness System            │
                           │                                                  │
  ┌──────────┐             │   ┌─────────────────────────────┐               │
  │          │─────────────┼──→│ Register Account            │               │
  │          │             │   └─────────────────────────────┘               │
  │          │             │   ┌─────────────────────────────┐               │
  │ Patient  │─────────────┼──→│ Login / Logout              │               │
  │          │             │   └─────────────────────────────┘               │
  │          │             │   ┌─────────────────────────────┐               │
  │          │─────────────┼──→│ Book Appointment (no doctor)│               │
  │          │             │   └─────────────────────────────┘               │
  │          │             │   ┌─────────────────────────────┐               │
  │          │─────────────┼──→│ View Appointment Status     │               │
  │          │             │   └─────────────────────────────┘               │
  │          │             │   ┌─────────────────────────────┐               │
  │          │─────────────┼──→│ Send Message                │               │
  │          │             │   └─────────────────────────────┘               │
  │          │             │   ┌─────────────────────────────┐               │
  │          │─────────────┼──→│ View Doctors                │               │
  └──────────┘             │   └─────────────────────────────┘               │
                           │                                                  │
  ┌──────────┐             │   ┌─────────────────────────────┐               │
  │ Principal│─────────────┼──→│ Login / Logout              │               │
  │  Admin   │             │   └─────────────────────────────┘               │
  │          │             │   ┌─────────────────────────────┐               │
  │          │─────────────┼──→│ View/Manage All Appointments│               │
  │          │             │   └─────────────────────────────┘               │
  │          │             │   ┌─────────────────────────────┐               │
  │          │─────────────┼──→│ Assign Doctor to Appointment│               │
  │          │             │   └─────────────────────────────┘               │
  │          │             │   ┌─────────────────────────────┐               │
  │          │─────────────┼──→│ Add/Edit/Remove Doctors     │               │
  │          │             │   └─────────────────────────────┘               │
  │          │             │   ┌─────────────────────────────┐               │
  │          │─────────────┼──→│ Add/Edit/Remove Admins      │               │
  │          │             │   └─────────────────────────────┘               │
  │          │             │   ┌─────────────────────────────┐               │
  │          │─────────────┼──→│ View Messages               │               │
  └──────────┘             │   └─────────────────────────────┘               │
                           │                                                  │
  ┌──────────┐             │   ┌─────────────────────────────┐               │
  │ Secondary│─────────────┼──→│ Add Doctors                 │               │
  │  Admin   │             │   └─────────────────────────────┘               │
  │          │             │   ┌─────────────────────────────┐               │
  │          │─────────────┼──→│ Assign Doctor to Appointment│               │
  │          │             │   └─────────────────────────────┘               │
  │          │             │   ┌─────────────────────────────┐               │
  │          │─────────────┼──→│ View Dashboard/Messages     │               │
  └──────────┘             │   └─────────────────────────────┘               │
                           │                                                  │
  ┌──────────┐             │   ┌─────────────────────────────┐               │
  │          │─────────────┼──→│ Login / Logout              │               │
  │  Doctor  │             │   └─────────────────────────────┘               │
  │          │             │   ┌─────────────────────────────┐               │
  │          │─────────────┼──→│ View Assigned Appointments  │               │
  │          │             │   └─────────────────────────────┘               │
  │          │             │   ┌─────────────────────────────┐               │
  │          │─────────────┼──→│ Accept/Reject Assignment    │               │
  │          │             │   └─────────────────────────────┘               │
  │          │             │   ┌─────────────────────────────┐               │
  │          │─────────────┼──→│ Self-Assign (Dept Requests) │               │
  │          │             │   └─────────────────────────────┘               │
  │          │             │   ┌─────────────────────────────┐               │
  │          │─────────────┼──→│ Mark Appointment Completed  │               │
  └──────────┘             │   └─────────────────────────────┘               │
                           └──────────────────────────────────────────────────┘
```

**Figure 2.4**: Use Case Diagram

### 2.5 API Design — RESTful Endpoints

The backend exposes the following API endpoints grouped by resource:

#### 2.5.1 User API (`/api/v1/user`)

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| POST | `/patient/register` | No | Register a new patient |
| POST | `/login` | No | Login (any role — Admin, Patient, Doctor) |
| GET | `/patient/me` | Patient Token | Get current patient details |
| GET | `/admin/me` | Admin Token | Get current admin details |
| GET | `/doctor/me` | Doctor Token | Get current doctor details |
| GET | `/patient/logout` | Patient Token | Logout patient |
| GET | `/admin/logout` | Admin Token | Logout admin |
| GET | `/doctor/logout` | Doctor Token | Logout doctor |
| GET | `/doctors` | No | Get all registered doctors |
| GET | `/admins` | Admin Token | Get all registered admins |
| POST | `/admin/addnew` | Admin + Principal | Register a new admin (sends welcome email) |
| POST | `/doctor/addnew` | Admin Token | Register a new doctor (sends welcome email) |
| PUT | `/admin/edit/:id` | Admin + Principal | Edit an admin's profile (sends email change notification if email changes) |
| DELETE | `/admin/delete/:id` | Admin + Principal | Delete a secondary admin |
| PUT | `/doctor/edit/:id` | Admin + Principal | Edit a doctor's profile (sends email change notification if email changes) |
| DELETE | `/doctor/delete/:id` | Admin + Principal | Delete a doctor (includes Cloudinary cleanup) |

#### 2.5.2 Appointment API (`/api/v1/appointment`)

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| POST | `/post` | Patient Token | Book a new appointment (no doctor selected) |
| GET | `/myappointments` | Patient Token | Get patient's own appointments |
| GET | `/getall` | Admin Token | Get all appointments |
| PUT | `/update/:id` | Admin Token | Update appointment status |
| PUT | `/assign` | Admin Token | Assign a doctor to an appointment |
| GET | `/doctors/:department` | Admin Token | Get doctors by department (for assignment) |
| DELETE | `/delete/:id` | Admin Token | Delete an appointment |
| GET | `/doctor/mypatients` | Doctor Token | Get doctor's assigned appointments |
| GET | `/doctor/unassigned` | Doctor Token | Get unassigned appointments in doctor's department |
| PUT | `/doctor/selfassign` | Doctor Token | Doctor self-assigns to an appointment |
| PUT | `/doctor/respond` | Doctor Token | Doctor accepts or rejects an assignment |
| PUT | `/doctor/complete` | Doctor Token | Doctor marks an appointment as completed |

#### 2.5.3 Message API (`/api/v1/message`)

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| POST | `/send` | No | Send a message |
| GET | `/getall` | Admin Token | Get all messages |

### 2.6 Authentication Algorithm

The system uses a triple-token authentication strategy where Admins, Patients, and Doctors each receive separate cookie-based JWT tokens:

```
ALGORITHM: User Authentication and Token Generation
────────────────────────────────────────────────────

INPUT:  email, password, confirmPassword, role
OUTPUT: JWT token (set as HTTP-only cookie)

1. VALIDATE that all fields are provided
2. IF password ≠ confirmPassword THEN
       RETURN Error("Passwords do not match")
3. QUERY user = Database.findByEmail(email)
4. IF user is NULL THEN
       RETURN Error("Invalid credentials")
5. isMatch = bcrypt.compare(password, user.hashedPassword)
6. IF isMatch is FALSE THEN
       RETURN Error("Invalid credentials")
7. IF role ≠ user.role THEN
       RETURN Error("Role mismatch")
8. token = JWT.sign({id: user._id}, SECRET_KEY, {expiresIn: "7d"})
9. cookieName = SWITCH(user.role):
       "Admin"   → "adminToken"
       "Patient" → "patientToken"
       "Doctor"  → "doctorToken"
10. SET HTTP-only Cookie(cookieName, token, expires: 7 days)
11. RETURN {success: true, user, token}
```

**Figure 2.5**: Authentication Algorithm (Triple-Token Strategy)

### 2.7 Appointment Workflow Algorithm

```
ALGORITHM: Five-State Appointment Workflow
──────────────────────────────────────────

STATE MACHINE:

  [Patient Books] → PENDING
                        │
                  [Admin Assigns Doctor]
                        │
                        ▼
                    ASSIGNED
                    │       │
        [Doctor Accepts]  [Doctor Rejects]
                │               │
                ▼               ▼
           ACCEPTED         REJECTED
                │          (Admin can re-assign)
       [Doctor Completes]
                │
                ▼
           COMPLETED

1. Patient submits appointment (department, condition, date, address)
   → Status = "Pending", doctorId = null
2. Admin views pending appointments, selects a doctor from the department
   → Status = "Assigned", doctorId = selected doctor
3. Doctor views assignment and responds:
   a. IF accepted → Status = "Accepted"
   b. IF rejected → Status = "Rejected" (admin sees and can re-assign)
4. When visit is complete, doctor marks it:
   → Status = "Completed"
```

**Figure 2.6**: Five-State Appointment Workflow

### 2.8 Principal Admin Role-Based Access

```
ALGORITHM: Principal vs Secondary Admin Authorization
──────────────────────────────────────────────────────

PRINCIPAL ADMIN: admin@ilera.com (hardcoded, cannot be deleted)

Permissions Matrix:
┌─────────────────────────┬──────────────┬───────────────┐
│ Action                  │ Principal    │ Secondary     │
├─────────────────────────┼──────────────┼───────────────┤
│ View Dashboard          │     ✅       │     ✅        │
│ View Doctors            │     ✅       │     ✅        │
│ Add New Doctor          │     ✅       │     ✅        │
│ Assign Doctor           │     ✅       │     ✅        │
│ View Messages           │     ✅       │     ✅        │
│ Add New Admin           │     ✅       │     ❌        │
│ Edit Doctor Profile     │     ✅       │     ❌        │
│ Remove Doctor           │     ✅       │     ❌        │
│ Manage Admins Page      │     ✅       │     ❌        │
│ Edit Admin Profile      │     ✅       │     ❌        │
│ Remove Admin            │     ✅       │     ❌        │
└─────────────────────────┴──────────────┴───────────────┘
```

**Figure 2.7**: Principal vs Secondary Admin Permissions

---

<div style="page-break-after: always;"></div>

## 3. Implementation and Results

### 3.1 Development Environment and Tools

| Category | Tool/Technology | Version | Purpose |
|----------|----------------|---------|---------|
| **IDE** | Visual Studio Code | Latest | Primary code editor with extensions for JavaScript, React, and Node.js |
| **Runtime** | Node.js | v24.x | Server-side JavaScript runtime |
| **Package Manager** | npm | v10.x | Dependency management |
| **Version Control** | Git & GitHub | Latest | Source code versioning and collaboration |
| **Database** | MongoDB Atlas | v7.x | Cloud-hosted NoSQL database |
| **API Testing** | Postman | Latest | API endpoint testing and debugging |
| **Browser** | Google Chrome | Latest | Frontend testing and debugging (DevTools) |
| **Cloud Storage** | Cloudinary | — | Doctor profile image storage |
| **Email Service** | Gmail SMTP | — | Automated email notifications via Nodemailer |

### 3.2 Libraries and Dependencies

#### 3.2.1 Backend Dependencies

| Library | Version | Purpose |
|---------|---------|---------|
| `express` | ^4.19.2 | Web application framework for building RESTful APIs |
| `mongoose` | ^8.5.4 | MongoDB object modelling and schema validation |
| `bcrypt` | ^5.1.1 | Password hashing with salt rounds |
| `jsonwebtoken` | ^9.0.2 | JWT token generation and verification |
| `cors` | ^2.8.5 | Cross-Origin Resource Sharing configuration |
| `dotenv` | ^16.4.5 | Environment variable management |
| `cookie-parser` | ^1.4.6 | HTTP cookie parsing middleware |
| `express-fileupload` | ^1.5.1 | Multipart file upload handling |
| `cloudinary` | ^2.4.0 | Cloud-based image upload and management |
| `validator` | ^13.12.0 | Input validation (email, length, etc.) |
| `nodemailer` | ^6.x | Email sending via Gmail SMTP (doctor/admin onboarding, email change alerts) |
| `nodemon` | ^3.1.14 | Development server with hot-reload (devDependency) |

#### 3.2.2 Frontend Dependencies (Admin, Patient & Doctor)

| Library | Version | Purpose |
|---------|---------|---------|
| `react` | ^18.3.1 | UI component library |
| `react-dom` | ^18.3.1 | React DOM rendering |
| `react-router-dom` | ^6.26.1 | Client-side routing and navigation |
| `axios` | ^1.7.x | HTTP client for API requests |
| `react-toastify` | ^10.0.5 | Toast notifications for user feedback |
| `react-icons` | ^5.3.0 | Icon library (status icons, UI controls) |
| `react-multi-carousel` | ^2.8.5 | Responsive carousel (Patient Portal only) |
| `vite` | ^5.4.1 | Frontend build tool and dev server |
| `@vitejs/plugin-react` | ^4.3.1 | React plugin for Vite |

### 3.3 Project Structure

```
Ilera-Health-Management-System/
├── Backend/
│   ├── config/
│   │   └── config.env              # Environment variables
│   ├── controller/
│   │   ├── userController.js       # User CRUD, auth, admin/doctor management, email dispatch
│   │   ├── appointmentController.js # Appointment CRUD, doctor assignment, doctor responses
│   │   └── messageController.js    # Message CRUD logic
│   ├── database/
│   │   └── dbConnection.js         # MongoDB connection setup
│   ├── middlewares/
│   │   ├── auth.js                 # JWT auth (Admin, Patient, Doctor, isPrincipalAdmin)
│   │   ├── catchAsyncErrors.js     # Async error wrapper
│   │   └── errorMiddleware.js      # Global error handler
│   ├── models/
│   │   ├── userSchema.js           # User model (NIN, 11-digit phone, bcrypt, JWT)
│   │   ├── appointmentSchema.js    # Appointment model (5-state, timestamps)
│   │   └── messageSchema.js        # Message model
│   ├── router/
│   │   ├── userRouter.js           # User API routes (16 endpoints)
│   │   ├── appointmentRouter.js    # Appointment API routes (12 endpoints)
│   │   └── messageRouter.js        # Message API routes (2 endpoints)
│   ├── utils/
│   │   ├── jwtToken.js             # Token generation utility
│   │   └── sendEmail.js            # Nodemailer: doctor/admin welcome, email change notification
│   ├── seedAdmin.js                # Seeds the principal admin account
│   ├── app.js                      # Express app configuration (3 CORS origins)
│   ├── server.js                   # Server entry point
│   └── package.json
│
├── Frontend-Admin/
│   ├── public/                     # Static assets (logo, icons)
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.jsx       # Appointments table, doctor assignment, descriptive statuses
│   │   │   ├── Login.jsx           # Admin login form
│   │   │   ├── AddNewDoctor.jsx    # Premium doctor registration form with spinner
│   │   │   ├── AddNewAdmin.jsx     # Premium admin registration form with spinner
│   │   │   ├── Doctors.jsx         # Doctors grid with edit/delete (principal only)
│   │   │   ├── ManageAdmins.jsx    # Admin list with role badges, edit/delete
│   │   │   ├── Messages.jsx        # Messages list view
│   │   │   ├── Sidebar.jsx         # Role-aware sidebar navigation
│   │   │   └── loading.jsx         # Loading spinner
│   │   ├── App.jsx                 # Root component with routing (/admins route)
│   │   ├── App.css                 # Green-themed premium design system
│   │   └── main.jsx                # Entry point with context provider
│   ├── vite.config.js
│   └── package.json
│
├── Frontend-Patient/
│   ├── public/                     # Static assets
│   ├── src/
│   │   ├── components/
│   │   │   ├── AppointmentForm.jsx # Appointment booking (dept, condition, date — no doctor)
│   │   │   ├── Biography.jsx       # Hospital biography section
│   │   │   ├── Departments.jsx     # Department carousel
│   │   │   ├── Hero.jsx            # Hero/banner section
│   │   │   ├── MessageForm.jsx     # Contact form
│   │   │   ├── Navbar.jsx          # Navigation bar
│   │   │   ├── Footer.jsx          # Page footer
│   │   │   └── loading.jsx         # Loading spinner
│   │   ├── pages/
│   │   │   ├── Home.jsx            # Home page
│   │   │   ├── Appointment.jsx     # Appointment page
│   │   │   ├── PatientDashboard.jsx # Patient's appointment tracker
│   │   │   ├── AboutUs.jsx         # About page
│   │   │   ├── Login.jsx           # Patient login page
│   │   │   └── Register.jsx        # Patient registration page
│   │   ├── App.jsx                 # Root component with routing
│   │   ├── App.css                 # Global styles
│   │   └── main.jsx                # Entry point with context provider
│   ├── vite.config.js
│   └── package.json
│
├── Frontend-Doctor/
│   ├── public/                     # Static assets
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.jsx           # Doctor login page
│   │   │   └── Dashboard.jsx       # Doctor dashboard (assigned, unassigned, accept/reject/complete)
│   │   ├── App.jsx                 # Root component with routing
│   │   ├── App.css                 # Doctor portal styles
│   │   └── main.jsx                # Entry point with context provider
│   ├── vite.config.js
│   └── package.json
│
└── final_project_report.md         # This report
```

**Figure 3.1**: Complete Project Directory Structure

### 3.4 Configuration and Settings

| Variable | Description | Example Value |
|----------|-------------|---------------|
| `PORT` | Backend server port | 4000 |
| `MONGO_URI` | MongoDB Atlas connection string | `mongodb+srv://...` |
| `JWT_SECRET_KEY` | Secret key for signing JWT tokens | (random secure string) |
| `JWT_EXPIRES` | JWT token expiration duration | 7d |
| `COOKIE_EXPIRE` | Cookie expiration in days | 7 |
| `FRONTEND_PATIENT` | Patient Portal URL (for CORS) | `http://localhost:5174` |
| `FRONTEND_ADMIN` | Admin Dashboard URL (for CORS) | `http://localhost:5173` |
| `FRONTEND_DOCTOR` | Doctor Portal URL (for CORS) | `http://localhost:5175` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud identifier | (from Cloudinary dashboard) |
| `CLOUDINARY_API_KEY` | Cloudinary API key | (from Cloudinary dashboard) |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | (from Cloudinary dashboard) |

### 3.5 Results

#### 3.5.1 API Endpoint Testing Results

| Endpoint | Method | Test Scenario | Expected | Actual | Result |
|----------|--------|---------------|----------|--------|--------|
| `/api/v1/user/patient/register` | POST | Valid registration | 200 | 200 | ✅ Pass |
| `/api/v1/user/patient/register` | POST | Duplicate email | 400 | 400 | ✅ Pass |
| `/api/v1/user/login` | POST | Valid admin credentials | 200 | 200 | ✅ Pass |
| `/api/v1/user/login` | POST | Valid doctor credentials | 200 | 200 | ✅ Pass |
| `/api/v1/user/login` | POST | Wrong password | 400 | 400 | ✅ Pass |
| `/api/v1/user/login` | POST | Wrong role | 400 | 400 | ✅ Pass |
| `/api/v1/user/admin/addnew` | POST | Principal admin adds admin | 200 | 200 | ✅ Pass |
| `/api/v1/user/admin/addnew` | POST | Secondary admin attempts | 403 | 403 | ✅ Pass |
| `/api/v1/user/doctor/addnew` | POST | Add doctor with avatar | 200 | 200 | ✅ Pass |
| `/api/v1/user/admins` | GET | List all admins | 200 | 200 | ✅ Pass |
| `/api/v1/user/doctor/edit/:id` | PUT | Principal edits doctor | 200 | 200 | ✅ Pass |
| `/api/v1/user/admin/delete/:id` | DELETE | Delete principal admin | 403 | 403 | ✅ Pass |
| `/api/v1/appointment/post` | POST | Valid appointment (no doctor) | 200 | 200 | ✅ Pass |
| `/api/v1/appointment/assign` | PUT | Admin assigns doctor | 200 | 200 | ✅ Pass |
| `/api/v1/appointment/doctor/respond` | PUT | Doctor accepts | 200 | 200 | ✅ Pass |
| `/api/v1/appointment/doctor/respond` | PUT | Doctor rejects | 200 | 200 | ✅ Pass |
| `/api/v1/appointment/doctor/complete` | PUT | Doctor marks completed | 200 | 200 | ✅ Pass |
| `/api/v1/appointment/doctor/selfassign` | PUT | Doctor self-assigns | 200 | 200 | ✅ Pass |
| `/api/v1/appointment/myappointments` | GET | Patient views own | 200 | 200 | ✅ Pass |
| `/api/v1/message/send` | POST | Valid message | 200 | 200 | ✅ Pass |

**Table 3.3**: API Endpoint Testing Results

#### 3.5.2 Frontend Feature Testing Results

| Feature | Portal | Test Scenario | Result |
|---------|--------|---------------|--------|
| Patient Registration | Patient | Register with NIN, phone, DOB | ✅ Pass |
| Patient Login | Patient | Login with valid credentials | ✅ Pass |
| View Doctors | Patient | View list of all doctors | ✅ Pass |
| Book Appointment | Patient | Book with department, condition, date (no doctor) | ✅ Pass |
| View Appointment Status | Patient | Track status on patient dashboard | ✅ Pass |
| Send Message | Patient | Submit contact form | ✅ Pass |
| Admin Login | Admin | Login with admin credentials | ✅ Pass |
| View Dashboard | Admin | View appointments with descriptive statuses | ✅ Pass |
| Assign Doctor | Admin | Assign doctor from department dropdown | ✅ Pass |
| Add New Doctor | Admin | Register doctor with avatar, spinner shown | ✅ Pass |
| Add New Admin | Admin | Principal adds admin, spinner shown | ✅ Pass |
| Manage Admins | Admin | View admin list with role badges | ✅ Pass |
| Edit Doctor | Admin | Principal edits doctor inline | ✅ Pass |
| Remove Doctor | Admin | Principal removes doctor with confirmation | ✅ Pass |
| Edit Admin | Admin | Principal edits secondary admin | ✅ Pass |
| Remove Admin | Admin | Principal removes secondary admin | ✅ Pass |
| Sidebar Role Awareness | Admin | Secondary admin sees limited menu | ✅ Pass |
| Doctor Login | Doctor | Login with emailed credentials | ✅ Pass |
| View Assigned Appointments | Doctor | See appointments assigned to them | ✅ Pass |
| Accept/Reject Assignment | Doctor | Respond to admin's assignment | ✅ Pass |
| Self-Assign | Doctor | Pick up unassigned dept appointment | ✅ Pass |
| Mark Completed | Doctor | Mark appointment as visit completed | ✅ Pass |
| Doctor Logout | Doctor | Logout clears doctorToken | ✅ Pass |
| Welcome Email | System | Email sent on doctor/admin creation | ✅ Pass |
| Email Change Alert | System | Email sent to old & new address | ✅ Pass |

**Table 3.4**: Frontend Feature Testing Results

#### 3.5.3 Appointment Status Labels

The system uses descriptive status labels across all three portals:

| Status | Admin Dashboard Label | Doctor Dashboard Label |
|--------|----------------------|----------------------|
| Pending | ⏳ Awaiting Doctor Assignment | — |
| Assigned | 📋 Doctor Assigned — Awaiting Response | 📋 Awaiting Your Response |
| Accepted | ✅ Doctor Confirmed | ✅ You Accepted — Active |
| Rejected | ❌ Doctor Declined — Needs Reassignment | — |
| Completed | 🏁 Visit Completed | 🏁 Visit Completed |

**Table 3.5**: Descriptive Appointment Status Labels

#### 3.5.4 Supported Hospital Departments

| # | Department |
|---|------------|
| 1 | Pediatrics |
| 2 | Orthopedics |
| 3 | Cardiology |
| 4 | Neurology |
| 5 | Oncology |
| 6 | Radiology |
| 7 | Physical Therapy |
| 8 | Dermatology |
| 9 | ENT (Ear, Nose and Throat) |

**Table 3.6**: Supported Hospital Departments

---

<div style="page-break-after: always;"></div>

## 4. Conclusion

### 4.1 Summary

The Ìlera Health & Wellness Management System was successfully designed, implemented, and tested as a full-stack web application that addresses the core operational needs of a hospital. The system demonstrates the practical application of system design and architecture principles taught in CSC 419, including:

- **Three-Tier Architecture**: The system cleanly separates the presentation, application logic, and data storage layers across three React.js frontends, a Node.js/Express.js API, and MongoDB Atlas.
- **MVC Pattern**: The backend code is organized following the Model-View-Controller pattern, ensuring a clear separation of concerns between data access, business logic, and request handling.
- **RESTful API Design**: The backend exposes 30 well-structured REST API endpoints that follow HTTP method conventions and return consistent JSON responses.
- **Role-Based Access Control**: The triple-token JWT authentication mechanism with principal/secondary admin hierarchy effectively restricts access to system resources based on user roles and privilege levels.
- **Multi-Portal Architecture**: Three distinct React.js SPAs serve the needs of patients, administrators, and doctors, each with a tailored user interface and workflow.
- **Five-State Workflow**: The appointment lifecycle (Pending → Assigned → Accepted/Rejected/Completed) provides granular tracking of appointment progress across all stakeholders.
- **Automated Email Notifications**: Nodemailer integration via Gmail SMTP provides automated onboarding emails and change notifications, reducing manual communication overhead.

### 4.2 Achievements

All the objectives stated in Section 1.3 were successfully achieved:

1. ✅ Three-tier client-server architecture was designed and implemented.
2. ✅ Secure JWT-based authentication with four-tier RBAC (Principal Admin, Secondary Admin, Doctor, Patient) was implemented.
3. ✅ A complete RESTful API with 30 endpoints was developed across user, appointment, and message modules.
4. ✅ Three separate React.js frontend applications were built (Admin, Patient, Doctor).
5. ✅ A five-state appointment workflow with admin-driven doctor assignment was implemented.
6. ✅ A NoSQL database schema with three collections and proper referencing was designed.
7. ✅ Cloud-based image storage via Cloudinary was integrated.
8. ✅ Automated email notifications via Nodemailer were implemented for staff onboarding and account changes.

### 4.3 Recommendations for Future Work

1. **Electronic Medical Records (EMR)**: Implement a module for storing and retrieving patient medical history, diagnosis, and treatment records.
2. **Real-Time Notifications**: Integrate WebSocket-based real-time notifications using Socket.io for appointment status updates.
3. **Billing and Payment Module**: Add support for invoice generation and online payment processing.
4. **Two-Factor Authentication (2FA)**: Enhance security with OTP verification via SMS or email.
5. **Advanced Search and Filtering**: Implement search functionality for patients, doctors, and appointments.
6. **Doctor Scheduling**: Add calendar-based availability management for doctors.
7. **Audit Logging**: Implement an audit trail for tracking all administrative actions for compliance and accountability.
8. **Mobile Application**: Develop a React Native mobile application for patients and doctors.

---

<div style="page-break-after: always;"></div>

## 5. References

1. Fielding, R. T. (2000). *Architectural Styles and the Design of Network-based Software Architectures*. Doctoral Dissertation, University of California, Irvine.
2. MongoDB Inc. (2024). *MongoDB Documentation*. Retrieved from https://www.mongodb.com/docs/
3. OpenJS Foundation. (2024). *Express.js Documentation*. Retrieved from https://expressjs.com/
4. Meta Platforms, Inc. (2024). *React Documentation*. Retrieved from https://react.dev/
5. Node.js Foundation. (2024). *Node.js Documentation*. Retrieved from https://nodejs.org/docs/
6. Auth0 Inc. (2024). *JSON Web Token (JWT) Introduction*. Retrieved from https://jwt.io/introduction
7. Cloudinary Ltd. (2024). *Cloudinary Documentation*. Retrieved from https://cloudinary.com/documentation
8. Nodemailer. (2024). *Nodemailer Documentation*. Retrieved from https://nodemailer.com/
9. Sommerville, I. (2015). *Software Engineering* (10th ed.). Pearson Education.
10. Pressman, R. S. (2014). *Software Engineering: A Practitioner's Approach* (8th ed.). McGraw-Hill.
11. Bass, L., Clements, P., & Kazman, R. (2012). *Software Architecture in Practice* (3rd ed.). Addison-Wesley.

---

<div style="page-break-after: always;"></div>

## 6. Appendix

### Appendix A: Backend Source Code

#### A.1 — Server Entry Point (`server.js`)

```javascript
import app from "./app.js";
import cloudinary from "cloudinary"

cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

app.listen(process.env.PORT, ()=>{
    console.log(`Server listening on port ${process.env.PORT}`);
});
```

#### A.2 — Express Application Configuration (`app.js`)

```javascript
import express from "express";
import { config } from "dotenv";
import cors from "cors"
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import { dbConnection } from "./database/dbConnection.js";
import { errorMiddleware } from "./middlewares/errorMiddleware.js";
import userRouter from "./router/userRouter.js"
import messageRouter from "./router/messageRouter.js"
import appointmentRouter from "./router/appointmentRouter.js"

const app = express();

config({ path: "./config/config.env" })

app.use(cors({
    origin: [process.env.FRONTEND_PATIENT, process.env.FRONTEND_ADMIN, process.env.FRONTEND_DOCTOR],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}))

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(fileUpload({ useTempFiles: true, tempFileDir: '/tmp/' }))

app.use("/api/v1/message", messageRouter)
app.use("/api/v1/user", userRouter)
app.use("/api/v1/appointment", appointmentRouter)

dbConnection();
app.use(errorMiddleware)

export default app;
```

#### A.3 — User Schema (`models/userSchema.js`)

```javascript
import mongoose from "mongoose"
import validator from "validator"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true, minLength: [3, "First Name must contain at least 3 characters!"] },
    lastName: { type: String, required: true, minLength: [2, "Last Name must contain at least 2 characters!"] },
    email: { type: String, required: true, validate: [validator.isEmail, "Please provide a valid Email!"] },
    phone: { type: String, required: true, maxLength: [11, "Phone number must contain exact 11 digits!"], minLength: [11, "Phone number must contain exact 11 digits!"] },
    nin: { type: String, required: true, maxLength: [11, "NIN must contain exact 11 digits!"], minLength: [11, "NIN must contain exact 11 digits!"] },
    dob: { type: Date, required: [true, "Date of Birth is required!"] },
    gender: { type: String, required: true, enum: ["Male", "Female", "Others"] },
    password: { type: String, required: true, minLength: [8, "Password must contain at least 8 characters!"], select: false },
    role: { type: String, required: true, enum: ["Admin", "Patient", "Doctor"] },
    doctrDptmnt: { type: String },
    doctrAvatar: { public_id: String, url: String }
})

userSchema.pre("save", async function(next) {
    if (!this.isModified("password")) { next() }
    this.password = await bcrypt.hash(this.password, 10)
})

userSchema.methods.comparePassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}

userSchema.methods.generateJsonWebToken = function() {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, { expiresIn: process.env.JWT_EXPIRES })
}

export const User = mongoose.model("User", userSchema)
```

#### A.4 — Appointment Schema (`models/appointmentSchema.js`)

```javascript
import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
    patientId: { type: mongoose.Schema.ObjectId, ref: "User", required: true },
    patientFirstName: { type: String, required: true },
    patientLastName: { type: String, required: true },
    patientEmail: { type: String, required: true },
    patientPhone: { type: String, required: true },
    department: { type: String, required: [true, "Please select a department!"] },
    condition: { type: String, required: [true, "Please describe your condition!"], minLength: [5, "Condition description must contain at least 5 characters!"] },
    appointment_date: { type: String, required: [true, "Please select an appointment date!"] },
    address: { type: String, required: [true, "Please provide your address!"] },
    doctor: { firstName: { type: String, default: null }, lastName: { type: String, default: null } },
    doctorId: { type: mongoose.Schema.ObjectId, ref: "User", default: null },
    hasVisited: { type: Boolean, default: false },
    status: { type: String, enum: ["Pending", "Assigned", "Accepted", "Rejected", "Completed"], default: "Pending" }
}, { timestamps: true })

export const Appointment = mongoose.model("Appointment", appointmentSchema);
```

#### A.5 — Authentication Middleware (`middlewares/auth.js`)

```javascript
import jwt from "jsonwebtoken";
import { User } from "../models/userSchema.js";
import { catchAsyncErrors } from "./catchAsyncErrors.js"
import ErrorHandler from "./errorMiddleware.js";

export const isAdminAuthenticated = catchAsyncErrors(async (req, res, next) => {
    const token = req.cookies.adminToken;
    if (!token) { return next(new ErrorHandler("Admin not authenticated!", 400)) }
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = await User.findById(decoded.id)
    if (req.user.role !== "Admin") { return next(new ErrorHandler(`${req.user.role} not authorized!`, 403)) }
    next()
})

export const isPatientAuthenticated = catchAsyncErrors(async (req, res, next) => {
    const token = req.cookies.patientToken;
    if (!token) { return next(new ErrorHandler("Please log in to continue!", 400)) }
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = await User.findById(decoded.id)
    if (req.user.role !== "Patient") { return next(new ErrorHandler(`${req.user.role} not authorized!`, 403)) }
    next()
})

export const isDoctorAuthenticated = catchAsyncErrors(async (req, res, next) => {
    const token = req.cookies.doctorToken;
    if (!token) { return next(new ErrorHandler("Doctor not authenticated!", 400)) }
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = await User.findById(decoded.id)
    if (req.user.role !== "Doctor") { return next(new ErrorHandler(`${req.user.role} not authorized!`, 403)) }
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
```

### Appendix B: Database Connection Module

```javascript
import mongoose from "mongoose";

export const dbConnection = () => {
    mongoose.connect(process.env.MONGO_URI, {
        dbName: "Ilera_Health_Wellness"
    }).then(() => {
        console.log("Connected to Database");
    }).catch(err => {
        console.log(`Some error occurred while connecting to Database: ${err}`);
    })
}
```

---

*End of Report*
