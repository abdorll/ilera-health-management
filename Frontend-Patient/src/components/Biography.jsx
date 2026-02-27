import React from "react";

const Biography = ({ imageUrl }) => {
  return (
    <div className="container biography">
      <div className="banner">
        <img src={imageUrl} alt="About Ìlera" />
      </div>

      <div className="banner">
        <p>About Us</p>
        <h3>Who We Are</h3>
        <p>
          Ìlera Health & Wellness is a premier healthcare provider located at the
          University of Lagos, Akoka, Lagos. We are dedicated to offering
          comprehensive medical services with exceptional care to the university
          community and beyond.
        </p>
        <p>
          Our facility is equipped with modern technology and staffed by highly
          skilled professionals, all focused on delivering excellent healthcare
          solutions that meet international standards.
        </p>
        <p>
          Our team of doctors, nurses, and support staff work collaboratively to
          provide comprehensive medical solutions across nine specialized departments.
        </p>
        <p>
          We believe in a patient-centered approach, where each individual's
          needs are addressed with attention, expertise, and the warmth of Nigerian
          hospitality.
        </p>
      </div>
    </div>
  );
};

export default Biography;
