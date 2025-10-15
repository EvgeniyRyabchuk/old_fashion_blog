import React from 'react';
import {Link} from "react-router-dom";
import PATHS from "@/constants/paths";

const AuthOffer = ({ className }) => {
    return (
        <div className={className}>
            <Link className="login-btn" style={{margin: "0 5px"}} to={PATHS.LOGIN}
               data-i18n="auth-login">Login
            </Link>
            <Link className="sign-up-btn" style={{margin: "0 5px"}} to={PATHS.SIGN_UP}
               data-i18n="auth-sign-up">Sign Up
            </Link>
        </div>
    );
};

export default AuthOffer;