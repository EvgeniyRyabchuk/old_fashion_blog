import React from 'react';
import './index.scss';
import Breadcrumb from "../../components/Breadcrumb";
import { useLang } from "@/context/LangContext";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { sendContactMessage } from "@/services/contact";
import {useFetching} from "@/hooks/useFetching";
import Spinner from "@components/Loader/Spinner";
import {toast} from "react-toastify";

const Contact = () => {
    const { t } = useLang();

    // Validation schema using Yup
    const validationSchema = Yup.object({
        name: Yup.string()
            .min(2, t("name-min-length") || "Name must be at least 2 characters")
            .max(50, t("name-max-length") || "Name must be less than 50 characters")
            .required(t("required") || "Name is required"),
        email: Yup.string()
            .email(t("invalid-email-address") || "Invalid email address")
            .required(t("required") || "Email is required"),
        subject: Yup.string()
            .min(5, t("subject-min-length") || "Subject must be at least 5 characters")
            .max(100, t("subject-max-length") || "Subject must be less than 100 characters")
            .required(t("required") || "Subject is required"),
        message: Yup.string()
            .min(10, t("message-min-length") || "Message must be at least 10 characters")
            .max(1000, t("message-max-length") || "Message must be less than 1000 characters")
            .required(t("required") || "Message is required")
    });

    const [sendMsg, isLoading, error] = useFetching(async (values) => await sendContactMessage(values))

    const handleSubmit = async (values, { setSubmitting, resetForm, setFieldError }) => {
        try {
            // Send the contact message to Firebase
            const result = sendMsg(values);
            console.log('Contact message sent successfully:', result);

            // Show success message
            toast.success('Thank you for your message! We will get back to you soon.');
            
            // Reset the form
            resetForm();
        } catch (error) {
            console.error('Error sending contact message:', error);
            // Show error to user
            alert(`Error: ${error.message || 'Failed to send your message. Please try again.'}`);
        } finally {
            setSubmitting(false);
        }
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
                            <Formik
                                initialValues={{
                                    name: '',
                                    email: '',
                                    subject: '',
                                    message: ''
                                }}
                                validationSchema={validationSchema}
                                onSubmit={handleSubmit}
                            >
                                {({ errors, touched }) => (
                                    <Form className="contact-form">
                                        <div className="form-group">
                                            <label htmlFor="name">{t("contact-name-label") || "Name"}</label>
                                            <Field
                                                type="text"
                                                id="name"
                                                name="name"
                                                placeholder={t("contact-name-placeholder") || "Enter your name"}
                                                className={errors.name && touched.name ? "error" : ""}
                                            />
                                            {errors.name && touched.name ? (
                                                <div className="error-message">{errors.name}</div>
                                            ) : null}
                                        </div>
                                        
                                        <div className="form-group">
                                            <label htmlFor="email">{t("contact-email-label") || "Email"}</label>
                                            <Field
                                                type="email"
                                                id="email"
                                                name="email"
                                                placeholder={t("contact-email-placeholder") || "Enter your email"}
                                                className={errors.email && touched.email ? "error" : ""}
                                            />
                                            {errors.email && touched.email ? (
                                                <div className="error-message">{errors.email}</div>
                                            ) : null}
                                        </div>
                                        
                                        <div className="form-group">
                                            <label htmlFor="subject">{t("contact-subject-label") || "Subject"}</label>
                                            <Field
                                                type="text"
                                                id="subject"
                                                name="subject"
                                                placeholder={t("contact-subject-placeholder") || "Enter subject"}
                                                className={errors.subject && touched.subject ? "error" : ""}
                                            />
                                            {errors.subject && touched.subject ? (
                                                <div className="error-message">{errors.subject}</div>
                                            ) : null}
                                        </div>
                                        
                                        <div className="form-group">
                                            <label htmlFor="message">{t("contact-message-label") || "Message"}</label>
                                            <Field
                                                as="textarea"
                                                id="message"
                                                name="message"
                                                placeholder={t("contact-message-placeholder") || "Enter your message"}
                                                rows="5"
                                                className={errors.message && touched.message ? "error" : ""}
                                            />
                                            {errors.message && touched.message ? (
                                                <div className="error-message">{errors.message}</div>
                                            ) : null}
                                        </div>
                                        
                                        <button type="submit" className="submit-btn">
                                            {t("contact-send-button") || "Send Message"}
                                            { isLoading && <Spinner style={{ marginLeft: "10px" }}/> }
                                        </button>
                                    </Form>
                                )}
                            </Formik>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Contact;