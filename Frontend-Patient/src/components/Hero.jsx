import React from 'react';

const Hero = ({ title, imageUrl }) => {
    return (
        <div className='hero container' >
            <div className="banner">
                <h1>{title}</h1>
                <p>
                    Ìlera Health & Wellness is a state-of-the-art healthcare facility
                    located at the University of Lagos, committed to providing comprehensive
                    medical services with compassion and expertise. Our team of skilled
                    professionals delivers personalized care tailored to each patient's
                    unique needs. At Ìlera, your well-being is our top priority.
                </p>
            </div>
            <div className="banner">
                <img src={imageUrl} alt="Hero" className='animated-image' />
                <span>
                    <img src="/Vector.png" alt="Vector" />
                </span>
            </div>
        </div>
    );
}

export default Hero;
