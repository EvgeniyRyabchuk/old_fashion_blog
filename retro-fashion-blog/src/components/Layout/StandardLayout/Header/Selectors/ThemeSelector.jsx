import React, {useEffect, useState} from 'react';
import {useLang} from "@/context/LangContext";

const root = document.documentElement;
const savedTheme = localStorage.getItem('theme') || 'default';
root.setAttribute('data-theme', savedTheme);

const ThemeSelector = () => {
    const { t } = useLang();
    const [value, setValue] = useState(savedTheme);

    const save = (theme) => {
        root.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        setValue(theme);
    }

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') || "default";
        save(savedTheme);
    }, [])

    const onChange = (e) => {
        save(e.target.value)
    }

    return (
        <div className="form-row">
            <select className="theme-select" id="themeSelector" onChange={onChange} defaultValue={value}>
                <option value="default" data-i18n="theme-default">{t("theme-default")}</option>
                <option value="light" data-i18n="theme-light">{t("theme-light")}</option>
                <option value="dark" data-i18n="theme-dark">{t("theme-dark")}</option>
            </select>
        </div>
    );
};

export default ThemeSelector;