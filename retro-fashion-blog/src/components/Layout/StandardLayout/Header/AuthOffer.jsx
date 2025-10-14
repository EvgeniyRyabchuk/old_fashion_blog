import React from 'react';

const AuthOffer = ({ className }) => {
    return (
        <div className={className}>
            <a className="login-btn" style={{margin: "0 5px"}} href="/login"
               data-i18n="auth-login">Login</a>
            <a className="sign-up-btn" style={{margin: "0 5px"}} href="/sign-up"
               data-i18n="auth-sign-up">Sign Up</a>
        </div>
    );
};

export default AuthOffer;