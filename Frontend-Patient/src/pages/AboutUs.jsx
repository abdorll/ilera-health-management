import React from "react";
import Hero from "../components/Hero";
import Biography from "../components/Biography";

const AboutUs = () => {
  return (
    <>
      <Hero
        title={"Learn More About Ìlera Health & Wellness"}
        imageUrl={`${import.meta.env.BASE_URL}about.png`}
      />
      <Biography imageUrl={`${import.meta.env.BASE_URL}whoweare.png`} />
    </>
  );
};

export default AboutUs;
