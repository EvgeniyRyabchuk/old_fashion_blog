import React from 'react';
import {Link} from "react-router-dom";
import PATHS from "@/constants/paths";
import './index.scss';
import {useLang} from "@/context/LangContext";
const AuthOffer = ({ className, onSelected }) => {
    const { t } = useLang();
    const onLogIn = (e) => {
        e.preventDefault();
        onSelected(PATHS.LOGIN);
    }

    const onSignUp = (e) => {
        e.preventDefault();
        onSelected(PATHS.SIGN_UP);
    }

    return (
        <div className={className}>
            <a
                className="login-btn"
                onClick={onLogIn}
                data-i18n="auth-login">
                {t("auth-login")}
            </a>
            <a
                className="sign-up-btn"
                onClick={onSignUp}
                data-i18n="auth-sign-up"
            >
                {t("auth-sign-up")}
            </a>
        </div>
    );
};

export default AuthOffer;