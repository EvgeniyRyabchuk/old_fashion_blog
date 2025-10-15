

import {lazy} from "react";
import Loadable from "@components/Loadable";
import PATHS from "@/constants/paths";

const Setting = Loadable(lazy(() => import('@pages/Setting')));

const AuthCommonRoutes = [
    {
        path: PATHS.SETTING,
        element: <Setting />,
        exact: true,
        authenticated: true,
    }
];


export default AuthCommonRoutes;

