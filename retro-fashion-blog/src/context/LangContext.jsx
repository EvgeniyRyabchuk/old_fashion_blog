import React, {createContext, useContext, useEffect, useState} from 'react';


import en from "@/lang/en.json";
import ua from "@/lang/ua.json";
import ru from "@/lang/ru.json";
import useQueryParams from "@/hooks/useQueryParams";

const LangContext = createContext();

const translations = { en, ua, ru };


export const LangProvider = ({ children }) => {

    const getInitialLang = () => {
        const params = new URLSearchParams(window.location.search);
        return (
            params.get("lang") ||
            localStorage.getItem("lang") ||
            navigator.language.slice(0, 2) ||
            "en"
        );
    };

    const [lang, setLang] = useState(getInitialLang);
    console.log(getInitialLang())
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

    // const { updateSearchParams, searchParams } = useQueryParams();

    // Update HTML lang + static texts
    useEffect(() => {
        document.documentElement.setAttribute("lang", lang);
        changeHtml();

        // persist to localStorage
        localStorage.setItem("lang", lang);

        // sync URL param
        const params = new URLSearchParams(window.location.search);
        params.set("lang", lang);
        window.history.replaceState({}, "", `${window.location.pathname}?${params}`);
    }, [lang]);


    const setLanguage = (newLang) => {
        if (!translations[newLang]) return;
        setLang(newLang);
        document.documentElement.setAttribute('lang', lang);
    };

    const t = (key) => {
        const current = translations[lang];
        return current?.[key];
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