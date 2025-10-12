import React, {useState} from 'react';
import i18n from "@utils/localizer";

const defaultLang = localStorage.getItem('lang') || 'en';

const LangSelector = () => {
    const [value, setValue] = useState(defaultLang);
    // Handle dropdown change
    const onChange = (e) => {
        setValue(e.target.value);
        i18n.setLanguage(e.target.value);
    };

    return (
        <div className="form-row">
            <select className="language-select" id="languageSelect" value={value} onChange={onChange}>
                <option value="ru" data-i18n="lang-ru">RU</option>
                <option value="ua" data-i18n="lang-ua">UA</option>
                <option selected value="en" data-i18n="lang-en">EN</option>
            </select>
        </div>
    );
};

export default LangSelector;