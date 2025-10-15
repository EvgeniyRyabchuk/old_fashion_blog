import Loadable from "@components/Loadable";
import {lazy} from "react";
import PATHS from "@/constants/paths";

const AuthForm = Loadable(lazy(() => import('@pages/AuthForm')));

// const PasswordResetPage = Loadable(lazy(() => import('../../../pages/sessions/PasswordReset')));
// const ForgetPasswordPage = Loadable(lazy(() => import('../../../pages/sessions/ForgetPassword')));


const SessionRoutes = [
    { path: PATHS.LOGIN, element: <AuthForm isAccountExist={true} />, exact: true},
    { path: PATHS.SIGN_UP, element: <AuthForm isAccountExist={false} />, exact: true},

    // { path: '/reset-password/:id/:token', element: <PasswordResetPage />, exact: true },
    // { path: '/forget-password', element: <ForgetPasswordPage />, exact: true },
];


export default SessionRoutes;