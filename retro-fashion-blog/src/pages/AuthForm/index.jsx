import React from 'react';
import './index.scss';
import {useAuth} from "@/context/AuthContext";
import {login, register} from "@/services/auth";
import {StandardLoader} from "@components/Loader";
import {Link, useNavigate} from "react-router-dom";
import PATHS from "@/constants/paths";
import {useFetching} from "@/hooks/useFetching";
import Spinner from "@components/Loader/Spinner";
import { Formik, Form, Field, ErrorMessage} from "formik";
import * as Yup from "yup";
import {useLang} from "@/context/LangContext";

const AuthForm = ({ isAccountExist }) => {

    const { user, setUser, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const { t } = useLang();
    
    const baseValidationSchema = Yup.object({
        email: Yup.string().email(t("invalid-email-address") || "Invalid email address").required(t("required") || "Required"),
        password: Yup.string()
            .min(6, t("password-min-length") || "Must be at least 6 characters")
            .max(100, t("password-max-length") || "Must be less than 100 characters")
            .required(t("required") || "Required"),
    });

    const [auth, isAuthTryLoading, error] = useFetching(async (values) => {
        let user = null;
        if(isAccountExist) {
            // For login, only use email and password
            user = await login(values.email, values.password);
        } else {
            // For registration, use name, email and password
            user = await register(values.name, values.email, values.password);
        }
        if(user) {
            setUser(user);
            navigate("/");
        }
    });

    const onSubmit = async (values) => {
        await auth(values);
        console.log('submit');
    }

    // 🌟 Define the final schema based on the prop
    const validationSchema = isAccountExist
        ? baseValidationSchema
        : baseValidationSchema.shape({
            name: Yup.string()
                .min(2, t("name-min-length") || "Must be at least 2 characters")
                .max(50, t("name-max-length") || "Must be less than 50 characters")
                .required(t("required") || "Required"),
        });
    // ----------------------------------------------------

    return (
        <section className="content-section">
            {!authLoading && user && (<h1>{user.id} </h1>) }
            {!authLoading && !user && (<StandardLoader isActive={authLoading}/>) }

            <Formik
                initialValues={{
                    name: '',
                    email: '',
                    password: ''
                }}
                validationSchema={validationSchema}
                onSubmit={onSubmit}
            >
                {({ errors, touched }) => (
                    <Form>
                        <div className="login-wrapper">
                            <h2>
                                {isAccountExist ? t("auth-login") || "Log in" : t("auth-sign-up") || "Sign up"}
                            </h2>

                            {!isAccountExist && (
                                <div className="input-group">
                                    <Field 
                                        id="name"
                                        name="name"
                                        type="text"
                                        placeholder={t("name-placeholder") || "Name"}
                                    />
                                    {errors.name && touched.name ? (
                                        <div className="error-message">{errors.name}</div>
                                    ) : null}
                                </div>
                            )}

                            <div className="input-group">
                                <Field 
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder={t("email-placeholder") || "Email"}
                                />
                                {errors.email && touched.email ? (
                                    <div className="error-message">{errors.email}</div>
                                ) : null}
                            </div>
                            
                            <div className="input-group">
                                <Field 
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder={t("password-placeholder") || "Password"}
                                />
                                {errors.password && touched.password ? (
                                    <div className="error-message">{errors.password}</div>
                                ) : null}
                            </div>

                            <button type="submit"
                                    disabled={isAuthTryLoading}>
                                    <>
                                        {isAccountExist ? t("auth-login") || "Login": t("auth-sign-up") || "Sign Up"}
                                        {isAuthTryLoading && <Spinner style={{ marginLeft: "5px"}} />}
                                    </>
                            </button>

                            {isAccountExist && (
                                <div className="extra">
                                    <p>
                                        <span>
                                            {t("dont-have-account") || "Don't have an account?"}
                                        </span>
                                        <Link to={PATHS.SIGN_UP}>
                                            {t("auth-sign-up") || "Sign up"}
                                        </Link>
                                    </p>
                                </div>
                            )}
                        </div>
                    </Form>
                )}
            </Formik>
        </section>
    );
};

export default AuthForm;