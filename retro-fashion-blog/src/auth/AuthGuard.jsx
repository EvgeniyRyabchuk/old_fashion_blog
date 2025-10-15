import React, {Fragment, useEffect} from 'react';
import {useNavigate} from "react-router-dom";
import {useAuth} from "@/context/AuthContext";
import roles from "@/auth/roles";

const AuthGuard = ({accessRoles, children}) => {
    console.log('authenticated guard');
    const {isAuth, loading, user} = useAuth();
    const navigate = useNavigate();
    // check authenticated

    const checkAuth = () => {
        if(!loading && !isAuth) {
            navigate('/statuses/not_authorized');
        }
    }

    // check roles
    const checkRole = () => {
        if(isAuth && accessRoles && accessRoles.length > 0) {
            const role = user.isAdmin ? roles.Admin : roles.User;
            const existAccessRole = accessRoles.find(ar => ar === role);
            if(!existAccessRole) {
                navigate('/statuses/forbidden');
            }
        }
    }

    useEffect(() => {
        checkAuth();
        checkRole();
    }, [isAuth])

    return (
        <Fragment>
            {isAuth && children}
        </Fragment>
    );
};

export default AuthGuard;