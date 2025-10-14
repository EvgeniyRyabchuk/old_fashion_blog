import React, {useState} from 'react';
import {useLang} from "@/context/LangContext";


const defaultLang = localStorage.getItem('lang') || 'en';

const LangSelector = () => {
    const { lang, setLanguage, t } = useLang();

    const onChange = (e) => {
        setLanguage(e.target.value);
    };

    return (
        <div className="form-row">
            <select
                className="language-select"
                id="languageSelect"
                value={lang}
                onChange={onChange}
            >
                <option value="ru" data-i18n="lang-ru">RU</option>
                <option value="ua" data-i18n="lang-ua">UA</option>
                <option value="en" data-i18n="lang-en">EN</option>
            </select>
        </div>
    );
};

export default LangSelector;