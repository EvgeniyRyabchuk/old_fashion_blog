import React from 'react';
import "./index.scss";
import { useLang } from "@/context/LangContext";

const Footer = () => {
    const { t } = useLang();

    return (
        <footer>
            <div className="footer-content">
                <div className="footer-col">
                    <div>
                        <span className="footer-label">{t("footer-contacts") || "Contacts"}</span>
                        <ul className="footer-data-wrapper">
                            <li className="footer-data-row">{t("footer-phone") || "0-800-33-00-16"}</li>
                            <li className="footer-data-row">{t("footer-social-buttons") || "Telegram and Viber buttons"}</li>
                            <li className="footer-data-row">{t("footer-hours") || "Mon-Sun: 10:00-19:00"}</li>
                        </ul>
                    </div>
                </div>
                <nav className="footer-col">
                    <div>
                        <span className="footer-label">{t("footer-about-company") || "About Company"}</span>
                        <ul className="footer-data-wrapper">
                            <li className="footer-data-row">{t("footer-about-us") || "About Us"}</li>
                            <li className="footer-data-row">{t("footer-stores") || "Our Stores"}</li>
                            <li className="footer-data-row">{t("footer-feedback") || "Feedback"}</li>
                            <li className="footer-data-row">{t("footer-bonus") || "Bonus Program"}</li>
                            <li className="footer-data-row">{t("footer-site-map") || "Site Map"}</li>
                        </ul>
                    </div>
                </nav>
                <nav className="footer-col">
                    <div>
                        <span className="footer-label">{t("footer-customers") || "For Customers"}</span>
                        <ul className="footer-data-wrapper">
                            <li className="footer-data-row">{t("footer-gift-certificates") || "Gift Certificates"}
                            </li>
                            <li className="footer-data-row">{t("footer-exchange-return") || "Exchange/Return"}</li>
                            <li className="footer-data-row">{t("footer-terms") || "User Agreement"}</li>
                            <li className="footer-data-row">{t("footer-questions") || "Questions and Answers"}</li>
                            <li className="footer-data-row">{t("footer-payment-shipping") || "Payment and Shipping"}</li>
                        </ul>
                    </div>
                </nav>
                <div className="footer-col">
                    <div>
                        <div>
                            <span className="footer-label">{t("footer-social") || "Our Social Networks"}</span>
                            <ul className="footer-data-wrapper d-flex">
                                <li className="footer-data-row">{t("footer-facebook") || "Facebook"}</li>
                                <li className="footer-data-row">{t("footer-instagram") || "Instagram"}</li>
                            </ul>
                            <span className="footer-label">{t("footer-payments") || "Payment Methods"}</span>
                            <ul className="footer-data-wrapper d-flex">
                                <li className="footer-data-row">{t("footer-visa") || "Visa"}</li>
                                <li className="footer-data-row">{t("footer-mastercard") || "Mastercard"}</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;