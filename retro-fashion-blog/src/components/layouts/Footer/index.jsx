import React from 'react';
import "./index.scss";

const Footer = () => {
    return (
        <footer>
            <div className="footer-content">
                <div className="footer-col">
                    <div>
                        <span className="footer-label" data-i18n="footer-contacts">Контакти</span>
                        <ul className="footer-data-wrapper">
                            <li className="footer-data-row" data-i18n="footer-phone">0-800-33-00-16</li>
                            <li className="footer-data-row">telegram_button viber_button</li>
                            <li className="footer-data-row" data-i18n="footer-hours">Пн-Нд: 10:00-19:00</li>
                        </ul>
                    </div>
                </div>
                <nav className="footer-col">
                    <div>
                        <span className="footer-label" data-i18n="footer-about-company">Про компанію</span>
                        <ul className="footer-data-wrapper">
                            <li className="footer-data-row" data-i18n="footer-about-us">Про нас</li>
                            <li className="footer-data-row" data-i18n="footer-stores">Нашi магазини</li>
                            <li className="footer-data-row" data-i18n="footer-feedback">Зворотний зв'язок</li>
                            <li className="footer-data-row" data-i18n="footer-bonus">Бонусна програма</li>
                            <li className="footer-data-row" data-i18n="footer-site-map">Мапа сайту</li>
                        </ul>
                    </div>
                </nav>
                <nav className="footer-col">
                    <div>
                        <span className="footer-label" data-i18n="footer-customers">Покупцям</span>
                        <ul className="footer-data-wrapper">
                            <li className="footer-data-row" data-i18n="footer-gift-certificates">Подарункові
                                сертифікати
                            </li>
                            <li className="footer-data-row" data-i18n="footer-exchange-return">Обмін/Повернення</li>
                            <li className="footer-data-row" data-i18n="footer-terms">Угода користувача</li>
                            <li className="footer-data-row" data-i18n="footer-questions">Питання та відповіді</li>
                            <li className="footer-data-row" data-i18n="footer-payment-shipping">Оплата та доставка</li>
                        </ul>
                    </div>
                </nav>
                <div className="footer-col">
                    <div>
                        <div>
                            <span className="footer-label" data-i18n="footer-social">Наші соцмережі</span>
                            <ul className="footer-data-wrapper d-flex">
                                <li className="footer-data-row" data-i18n="footer-facebook">Facebook</li>
                                <li className="footer-data-row" data-i18n="footer-instagram">Instagram</li>
                            </ul>
                            <span className="footer-label" data-i18n="footer-payments">Приймаємо до оплати</span>
                            <ul className="footer-data-wrapper d-flex">
                                <li className="footer-data-row" data-i18n="footer-visa">Visa</li>
                                <li className="footer-data-row" data-i18n="footer-mastercard">Mastercard</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;