import React, {createContext, useContext, useEffect, useState} from 'react';


import en from "@/lang/en.json";
import ua from "@/lang/ua.json";
import ru from "@/lang/ru.json";

const LangContext = createContext();

const translations = { en, ua, ru };


export const LangProvider = ({ children }) => {
    const [lang, setLang] =
        useState(localStorage.getItem("lang") || "en");

    const changeHtml = () => {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            el.textContent = translations[lang][key] || key;
        });

        // Translate attributes like placeholder, title, etc.
        document.querySelectorAll('[data-i18n-attr]').forEach(el => {
            const attrData = el.getAttribute('data-i18n-attr');
            // Example: placeholder:search-placeholder
            const [attr, key] = attrData.split(':');
            if (translations[lang][key])
                el.setAttribute(attr, translations[lang][key]);
        });
    }


    // 🔄 update <html lang="..."> whenever language changes
    useEffect(() => {
        document.documentElement.setAttribute("lang", lang);
        changeHtml();
    }, [lang]);

    // 🔁 persist to localStorage
    useEffect(() => {
        localStorage.setItem("lang", lang);
    }, [lang]);


    const setLanguage = (newLang) => {
        if (!translations[newLang]) return;
        setLang(newLang);

        document.documentElement.setAttribute('lang', lang);
    };

    const t = (key) => {
        const current = translations[lang];
        return current?.[key] || key;
    };

    const getLocCatName = (category) => {
        const localizedName = category[`name_${lang}`];
        return localizedName || category.name_en;
    };

    return (
        <LangContext.Provider value={{ lang, setLanguage, t, getLocCatName }}>
            {children}
        </LangContext.Provider>
    );
};



export const useLang = () => useContext(LangContext);