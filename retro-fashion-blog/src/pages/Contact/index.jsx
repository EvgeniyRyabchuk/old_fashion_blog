import React, { useState } from 'react';
import './index.scss';
import Breadcrumb from "../../components/Breadcrumb";
import { useLang } from "@/context/LangContext";

const Contact = () => {
    const { t } = useLang();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // In a real application, you would send this data to a backend
        console.log('Form submitted:', formData);
        alert('Thank you for your message! We will get back to you soon.');
        setFormData({ name: '', email: '', subject: '', message: '' });
    };

    return (
        <>
            <Breadcrumb
                items={[
                    { to: "/", label: t("nav-home") || "Home" },
                    { label: t("title-contact") || "Contact" },
                ]}
            />
            <section className="content-section contact-page">
                <div className="contact-container">
                    <h1 className="contact-title">{t("contact-title") || "Contact Us"}</h1>
                    
                    <div className="contact-content-wrapper">
                        <div className="contact-info-section">
                            <h2>{t("contact-get-in-touch") || "Get In Touch"}</h2>
                            <p className="contact-description">
                                {t("contact-description") || "Have questions about vintage fashion, styling tips, or want to collaborate with us? We'd love to hear from you! Reach out using the form or contact details below."}
                            </p>
                            
                            <div className="contact-details">
                                <div className="contact-item">
                                    <h3>{t("contact-email-title") || "Email"}</h3>
                                    <p>{t("contact-email-value") || "contact@retrofashionblog.com"}</p>
                                </div>
                                
                                <div className="contact-item">
                                    <h3>{t("contact-business-title") || "Business Inquiries"}</h3>
                                    <p>{t("contact-business-value") || "business@retrofashionblog.com"}</p>
                                </div>
                                
                                <div className="contact-item">
                                    <h3>{t("contact-social-title") || "Social Media"}</h3>
                                    <p>{t("contact-social-value") || "Follow us @retrofashionblog"}</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="contact-form-section">
                            <h2>{t("contact-send-message-title") || "Send Us a Message"}</h2>
                            <form onSubmit={handleSubmit} className="contact-form">
                                <div className="form-group">
                                    <label htmlFor="name">{t("contact-name-label") || "Name"}</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        placeholder={t("contact-name-placeholder") || "Enter your name"}
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                
                                <div className="form-group">
                                    <label htmlFor="email">{t("contact-email-label") || "Email"}</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        placeholder={t("contact-email-placeholder") || "Enter your email"}
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                
                                <div className="form-group">
                                    <label htmlFor="subject">{t("contact-subject-label") || "Subject"}</label>
                                    <input
                                        type="text"
                                        id="subject"
                                        name="subject"
                                        placeholder={t("contact-subject-placeholder") || "Enter subject"}
                                        value={formData.subject}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                
                                <div className="form-group">
                                    <label htmlFor="message">{t("contact-message-label") || "Message"}</label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        placeholder={t("contact-message-placeholder") || "Enter your message"}
                                        rows="5"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                    ></textarea>
                                </div>
                                
                                <button type="submit" className="submit-btn">
                                    {t("contact-send-button") || "Send Message"}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Contact;