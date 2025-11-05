import React from 'react';
import './index.scss';
import Breadcrumb from "../../components/Breadcrumb";
import { useLang } from "@/context/LangContext";

const About = () => {
    const { t } = useLang();

    return (
        <>
            <Breadcrumb
                items={[
                    { to: "/", label: t("nav-home") || "Home" },
                    { label: t("title-about") || "About" },
                ]}
            />
            <section className="content-section about-page">
                <div className="about-container">
                    <h1 className="about-title">{t("about-title") || "About Our Retro Fashion Blog"}</h1>
                    
                    <div className="about-content-wrapper">
                        <div className="about-intro">
                            <p className="about-description">
                                {t("about-description") || "Welcome to our retro fashion blog! We're passionate about celebrating the timeless elegance and unique style of vintage fashion. Our mission is to inspire and educate fashion enthusiasts about the beauty of bygone eras and how to incorporate retro elements into modern wardrobes."}
                            </p>
                        </div>

                        <div className="about-mission-vision">
                            <div className="mission-section">
                                <h2>{t("about-our-mission") || "Our Mission"}</h2>
                                <p>
                                    {t("about-mission-text") || "We aim to preserve and promote the rich history of fashion, showcasing how classic styles continue to influence contemporary design. Through our carefully curated content, we provide insights into the evolution of fashion and the stories behind iconic pieces."}
                                </p>
                            </div>

                            <div className="vision-section">
                                <h2>{t("about-our-vision") || "Our Vision"}</h2>
                                <p>
                                    {t("about-vision-text") || "To become the premier destination for vintage and retro fashion enthusiasts, offering authentic content, styling tips, and resources that celebrate the enduring appeal of fashion's most memorable eras."}
                                </p>
                            </div>
                        </div>

                        <div className="about-team">
                            <h2>{t("about-meet-our-team") || "Meet Our Team"}</h2>
                            <div className="team-members">
                                <div className="team-member">
                                    <h3>{t("about-fashion-historian") || "Fashion Historian"}</h3>
                                    <p>
                                        {t("about-historian-description") || "Our team includes certified fashion historians who bring expertise in the cultural and social contexts of different fashion eras, ensuring authentic and educational content."}
                                    </p>
                                </div>
                                <div className="team-member">
                                    <h3>{t("about-styling-experts") || "Styling Experts"}</h3>
                                    <p>
                                        {t("about-experts-description") || "Professional stylists with years of experience help bridge the gap between vintage aesthetics and modern styling, offering practical advice for incorporating retro elements."}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="about-values">
                            <h2>{t("about-our-values") || "Our Values"}</h2>
                            <div className="values-grid">
                                <div className="value-item">
                                    <h3>{t("about-authenticity") || "Authenticity"}</h3>
                                    <p>{t("about-authenticity-description") || "We value originality and historical accuracy in our content and recommendations."}</p>
                                </div>
                                <div className="value-item">
                                    <h3>{t("about-sustainability") || "Sustainability"}</h3>
                                    <p>{t("about-sustainability-description") || "Promoting vintage and retro fashion as sustainable alternatives to fast fashion."}</p>
                                </div>
                                <div className="value-item">
                                    <h3>{t("about-education") || "Education"}</h3>
                                    <p>{t("about-education-description") || "Providing in-depth knowledge about the cultural significance of fashion trends."}</p>
                                </div>
                                <div className="value-item">
                                    <h3>{t("about-community") || "Community"}</h3>
                                    <p>{t("about-community-description") || "Fostering a community of like-minded individuals who share our passion for retro fashion."}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default About;