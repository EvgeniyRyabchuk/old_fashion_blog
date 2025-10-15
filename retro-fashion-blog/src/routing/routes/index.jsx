import Loadable from "../../components/Loadable";
import {lazy} from "react";

import PublicRoutes from "./pubic";
import UserRoutes from "./auth/user";
import AdminsRoutes from "./auth/admin";
import _404NotFound from "@pages/statuses/http/_404NotFound";
import AuthCommonRoutes from "@/routing/routes/auth/common";


const routes = [
    ...PublicRoutes,
    ...UserRoutes,
    ...AdminsRoutes,
    ...AuthCommonRoutes,

    { path: '*', element: <_404NotFound/>, exact: true }
];

export default routes;