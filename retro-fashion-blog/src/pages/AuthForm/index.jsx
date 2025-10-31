import React from 'react';
import './index.scss';
import {useAuth} from "@/context/AuthContext";
import {login, register} from "@/services/auth";
import {StandardLoader} from "@components/Loader";
import {Link, useNavigate} from "react-router-dom";
import PATHS from "@/constants/paths";
import {useFetching} from "@/hooks/useFetching";
import Spinner from "@components/Loader/Spinner";


const AuthForm = ({ isAccountExist }) => {

    const [name, setName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const { user, setUser, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const [auth, isAuthTryLoading, error] = useFetching(async () => {
        let user = null;
        if(isAccountExist) {
            user = await login(email, password);
        } else {
            user = await register(name, email, password);
        }
        if(user) {
            setUser(user);
            navigate("/");
        }
    });

    const onAuthBtnCLick = async () => {
        auth();
    }

    const onKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault(); // optional, stops form submit if inside a form
            console.log("Enter pressed!");
            onAuthBtnCLick();
        }
    }



    return (
        <section className="content-section">
            {!authLoading && user && (<h1>{user.id} </h1>) }
            {!authLoading && !user && (<StandardLoader isActive={authLoading}/>) }

            <div className="login-wrapper">
                <h2
                    data-i18n={isAccountExist ? "authenticated-login": "authenticated-sign-up"}>
                    {isAccountExist ? "Log in" : "Sign up"}
                </h2>

                {!isAccountExist ? (
                    <div className="input-group">
                        <input id="name"
                               type="text"
                               placeholder="Name"
                               data-i18n-attr="placeholder:name-placeholder"
                               onChange={(e) => setName(e.target.value)}
                               onKeyDown={onKeyDown}
                        />
                    </div>
                ) : null}

                <div className="input-group">
                    <input id="email"
                           type="email"
                           data-i18n-attr="placeholder:email-placeholder"
                           placeholder="Email"
                           onChange={(e) => setEmail(e.target.value)}
                           onKeyDown={onKeyDown}
                    />
                </div>
                <div className="input-group">
                    <input id="password"
                           type="password"
                           data-i18n-attr="placeholder:password-placeholder"
                           placeholder="Password"
                           onChange={(e) => setPassword(e.target.value)}
                           onKeyDown={onKeyDown}
                    />
                </div>

                <button type="button"
                        onClick={onAuthBtnCLick}
                        data-i18n="auth-login">
                        <>
                            {isAccountExist ? "Login": "Sign Up"}
                            {isAuthTryLoading && <Spinner style={{ marginLeft: "5px"}} />}
                        </>
                </button>

                {isAccountExist && (
                    <div className="extra">
                        <p>
                            <span data-i18n="dont-have-account">
                                Don't have an account?
                            </span>
                            <Link to={PATHS.SIGN_UP}
                               data-i18n="auth-sign-up">
                                Sign up
                            </Link>
                        </p>
                    </div>
                ) }

            </div>

        </section>
    );
};

export default AuthForm;