import React from 'react';
import './index.scss';
import {useAuth} from "@/context/AuthContext";
import {login, register} from "@/services/auth";
import {StandardLoader} from "@components/Loader";


const AuthForm = ({ isAccountExist }) => {

    const [name, setName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const { user, setUser, loading: authLoading } = useAuth();

    const onAuthBtnCLick = async () => {
        let user = null;
        if(isAccountExist) {
             user = await login(email, password);
        } else {
            user = await register(name, email, password);
        }
        if(user) setUser(user);
    }

    return (
        <section className="content-section">
            {!authLoading && user ? (<h1>{user.id} </h1>) : ""}
            {!authLoading && !user ? (<StandardLoader isActive={authLoading}/>) : ""}

            <div className="login-wrapper">
                <h2
                    data-i18n={isAccountExist ? "auth-login": "auth-sign-up"}>
                    {isAccountExist ? "Log in" : "Sign up"}
                </h2>

                {!isAccountExist ? (
                    <div className="input-group">
                        <input id="name"
                               type="text"
                               placeholder="Name"
                               data-i18n-attr="placeholder:name-placeholder"
                               onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                ) : null}

                <div className="input-group">
                    <input id="email"
                           type="email"
                           data-i18n-attr="placeholder:email-placeholder"
                           placeholder="Email"
                           onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="input-group">
                    <input id="password"
                           type="password"
                           data-i18n-attr="pla  ceholder:password-placeholder"
                           placeholder="Password"
                           onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <button type="button"
                        onClick={onAuthBtnCLick}
                        data-i18n="auth-login">
                    {isAccountExist ? "Login": "Sign Up"}
                </button>

                {isAccountExist ? (
                    <div className="extra">
                        <p>
                            <snan data-i18n="dont-have-account">
                                Don't have an account?
                            </snan>
                            <a href="./register.html"
                               data-i18n="auth-sign-up">
                                Sign up
                            </a></p>
                    </div>
                ) : ""}

            </div>

        </section>
    );
};

export default AuthForm;