import Loadable from "../../components/Loadable";
import {lazy} from "react";
import _404NotFound from "@pages/NotFound";
import PublicRoutes from "./pubic";
import UserRoutes from "./user";
import AdminsRoutes from "./admin";




const routes = [
    // { path: '/profile', element: <AboutPage />, exact: true, authenticated: true },

    ...PublicRoutes,
    ...UserRoutes,
    ...AdminsRoutes,

    { path: '*', element: <_404NotFound/>, exact: true }
];

export default routes;