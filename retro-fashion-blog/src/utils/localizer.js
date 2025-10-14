import en from "@/lang/en.json";
import ua from "@/lang/ua.json";
import ru from "@/lang/ru.json";

const createLocalizer = () => {
    let translations = { en, ua, ru };
    async function setLanguage(lang) {
        localStorage.setItem('lang', translations[lang]);
        document.documentElement.setAttribute('lang', lang);

        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            el.textContent = translations[lang][key] || key;
        });

        // Translate attributes like placeholder, title, etc.
        document.querySelectorAll('[data-i18n-attr]').forEach(el => {
            const attrData = el.getAttribute('data-i18n-attr');
            // Example: placeholder:search-placeholder
            const [attr, key] = attrData.split(':');
            if (translations[key]) el.setAttribute(attr, translations[key]);
        });
    }

    const getLocCatName = (category, value) => {
        return category[`name_${value}` || category.name_en];
    }

    const translate = (key) => {
        return translations ? translations[key] : 'no translation';
    }

    return {
        setLanguage,
        translate
    }
}


export default createLocalizer;