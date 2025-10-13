import React, {useState} from 'react';

const root = document.documentElement;
const savedTheme = localStorage.getItem('theme') || 'default';
root.setAttribute('data-theme', savedTheme);

const ThemeSelector = () => {

    const [value, setValue] = useState(savedTheme);

    const onChange = (e) => {
        const theme = e.target.value;
        root.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        setValue(theme);
    }

    return (
        <div className="form-row">
            <select className="theme-select" id="themeSelector" onChange={onChange}>
                <option value="default" data-i18n="theme-default">Default</option>
                <option value="light" data-i18n="theme-light">Light</option>
                <option value="dark" data-i18n="theme-dark">Dark</option>
            </select>
        </div>
    );
};

export default ThemeSelector;