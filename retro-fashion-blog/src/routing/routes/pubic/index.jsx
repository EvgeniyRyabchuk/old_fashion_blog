import Loadable from "../../../components/Loadable";
import {lazy} from "react";
import About from "@pages/About";
import Home from "@pages/Home";
import SessionRoutes from "@/routing/routes/pubic/sessions";
import StatusesRoutes from "@/routing/routes/pubic/statuses";
import PATHS from "@/constants/paths";


const PublicRoutes = [
    { path: PATHS.HOME, element: <Home />, exact: true },
    { path: PATHS.ABOUT, element: <About />, exact: true},


    ...SessionRoutes,
    ...StatusesRoutes
];


export default PublicRoutes;