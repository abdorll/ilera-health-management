import React from 'react';
import Hero from '../components/Hero';
import Biography from '../components/Biography';
import Departments from '../components/Departments';
import MessageForm from '../components/MessageForm';

const Home = () => {
    return (
        <>
            <Hero
                title={"Ìlera Health & Wellness — Where Your Health Comes First"}
                imageUrl={`${import.meta.env.BASE_URL}hero.png`}
            />
            <Biography imageUrl={`${import.meta.env.BASE_URL}about.png`} />
            <Departments />
            <MessageForm />
        </>
    );
}

export default Home;
