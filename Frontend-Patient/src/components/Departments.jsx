import React from "react";
import { FaBaby, FaBone, FaHeartbeat, FaBrain, FaMicroscope, FaXRay, FaRunning, FaAllergies, FaHeadSideCough } from "react-icons/fa";

const Departments = () => {
  const departmentsArray = [
    {
      name: "Pediatrics",
      icon: <FaBaby />,
      description: "Comprehensive healthcare for infants, children, and adolescents including vaccinations, growth monitoring, and childhood illness treatment."
    },
    {
      name: "Orthopedics",
      icon: <FaBone />,
      description: "Diagnosis and treatment of musculoskeletal conditions including bones, joints, ligaments, tendons, and muscles."
    },
    {
      name: "Cardiology",
      icon: <FaHeartbeat />,
      description: "Expert care for heart and cardiovascular conditions including hypertension, heart failure, and preventive cardiac health."
    },
    {
      name: "Neurology",
      icon: <FaBrain />,
      description: "Specialized treatment for disorders of the nervous system including headaches, epilepsy, stroke, and neurological conditions."
    },
    {
      name: "Oncology",
      icon: <FaMicroscope />,
      description: "Advanced cancer care including early detection, diagnosis, chemotherapy, and comprehensive oncological treatment plans."
    },
    {
      name: "Radiology",
      icon: <FaXRay />,
      description: "State-of-the-art medical imaging services including X-rays, CT scans, MRI, and ultrasound for accurate diagnosis."
    },
    {
      name: "Physical Therapy",
      icon: <FaRunning />,
      description: "Rehabilitation and recovery programs to restore movement, reduce pain, and improve physical function after injury or surgery."
    },
    {
      name: "Dermatology",
      icon: <FaAllergies />,
      description: "Expert care for skin, hair, and nail conditions including acne, eczema, skin infections, and cosmetic dermatology."
    },
    {
      name: "ENT",
      icon: <FaHeadSideCough />,
      description: "Ear, Nose & Throat specialist services for hearing issues, sinusitis, tonsillitis, and respiratory conditions."
    },
  ];

  return (
    <div className="container departments-section">
      <div className="departments-header">
        <h2>Our Departments</h2>
        <p>Explore our specialized medical departments staffed by experienced professionals</p>
      </div>
      <div className="departments-grid">
        {departmentsArray.map((dept, index) => (
          <div className="dept-display-card" key={index}>
            <div className="dept-display-icon">
              {dept.icon}
            </div>
            <h3>{dept.name}</h3>
            <p>{dept.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Departments;
