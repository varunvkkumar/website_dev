import React from 'react';
import './HomePage.css';

function HomePage() {
    return (
        <div>
            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-content">
                    <h1>Empowering Innovation with AI-Powered Solutions</h1>
                    <p>Transforming industries through cutting-edge artificial intelligence technologies.</p>
                    <a href="#contact" className="cta-button">Get in Touch</a>
                </div>
            </section>

            {/* About Us Section */}
            <section className="about-section">
                <h2>About Shoonya AI</h2>
                <p>
                    Shoonya AI is a premier AI company committed to developing innovative AI products across various domains. 
                    Our mission is to harness the power of artificial intelligence to drive transformation and growth for businesses worldwide.
                </p>
            </section>

            {/* Services Section */}
            <section className="services-section">
                <h2>Our Services</h2>
                <div className="services">
                    <div className="service-item">
                        <h3>Health</h3>
                        <p>Revolutionizing healthcare with AI solutions for improved patient outcomes and operational efficiency.</p>
                    </div>
                    <div className="service-item">
                        <h3>Marketing Tech</h3>
                        <p>Enhancing customer engagement through AI-driven marketing tools and analytics.</p>
                    </div>
                    <div className="service-item">
                        <h3>Gaming</h3>
                        <p>Creating immersive gaming experiences powered by advanced AI technologies.</p>
                    </div>
                    <div className="service-item">
                        <h3>Energy</h3>
                        <p>Optimizing energy consumption with AI for sustainable and efficient operations.</p>
                    </div>
                </div>
            </section>

            {/* Technologies Section */}
            <section className="technologies-section">
                <h2>Our Technologies</h2>
                <p>
                    Expertise in supervised and unsupervised AI, generative AI, Large Language Models (LLMs), diffusion models, GANs, and more.
                </p>
            </section>

            {/* Contact Section */}
            <section className="contact-section" id="contact">
                <h2>Contact Us</h2>
                <p>Ready to transform your business with AI? Get in touch with us today.</p>
                <a href="mailto:contact@shoonya-ai.com" className="contact-button">Email Us</a>
            </section>
        </div>
    );
}

export default HomePage;