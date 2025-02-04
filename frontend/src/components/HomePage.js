import React from 'react';
import './HomePage.css';

function HomePage() {
  const heroStyle = {
    backgroundImage: `url(/assets/images/hero-image.jpg)`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section" style={heroStyle}>
        <div className="hero-content">
          <h1>Offering Domain Specific AI Models and Agentic Solutions to Transform Enterprises</h1>
          <p>Empowering Innovation and problem solving through cutting-edge artificial intelligence technologies.</p>
          <a href="#contact" className="cta-button">Get a Free Cosultation</a>
        </div>
      </section>

      {/* About Us Section */}
      <section className="about-section">
        <h2>Key Offerings</h2>
        <p>
        Atharva AI is a leading company dedicated to delivering domain-specific AI models and agentic solutions that transform industries.
        By harnessing domain data, and cutting-edge artificial intelligence technologies including Machine Learning, Deep Learning, Transfer Learning, Process Modeling, and Operation Research 
        we empower innovation and enable effective problem solving, driving growth and transformation for businesses worldwide.
        </p>
        <p>
        We offer a wide range of tailored AI products and services—from bespoke predictive, generative, process and OR models,
        to autonomous agents that streamline operations and enhance decision-making. 
        </p>
        <p>
        We follow a three step process to ensure your enterprise is able to reap benefits of AI revolution in a cost effective and efficient manner:
        1. Robust AI Strategy - Understand your business and data. Based on that device a realistic AI strategy.
        2. Efficient AI Deployment - Develop and deploy AI models and agents that are tailored to your business needs.
        3. Business Impact Validation - Monitor and maintain the AI models and agents to ensure they are delivering the desired results which can be validated in improving your business metrics (KPIs). 
        </p>
      </section>

      {/* Services Section */}
      <section className="services-section">
        <h2>Our Products</h2>
        <div className="services">
          <div className="service-item">
            <h3>Domain-Specific AI Models</h3>
            <p>
            Custom AI models deployable on our servers, your infrastructure, or edge devices like mobile phones and Raspberry Pi.
            </p>
          </div>
          <div className="service-item">
            <h3>Domain-Specific AI Agents</h3>
            <p>
            Intelligent agents powered by specialized or foundation models, optimized for on-premises, cloud, or edge environments.
            </p>
          </div>
          <div className="service-item">
            <h3>AI-Transformation-Hub</h3>
            <p>
            A unified platform to consolidate your data and build custom AI models on our scalable compute infrastructure.
            </p>
          </div>
        </div>
      </section>

      {/* Technologies Section */}
      <section className="technologies-section">
        <h2>Industry Specialization</h2>
        <p>
        Our expertise spans marketing, health, energy, carbon, agriculture, manufacturing, and mining. With our powerful AI tooling, we enable innovation in any industry—no matter your field, our solutions are designed to drive success.
        </p>
      </section>

      {/* Contact Section */}
      <section className="contact-section" id="contact">
        <h2>Contact Us</h2>
        <p>Ready to transform your business with AI? Get a free consultation today.</p>
        <a href="mailto:contact@shoonya-ai.com" className="contact-button">Email Us</a>
      </section>
    </div>
  );
}

export default HomePage;