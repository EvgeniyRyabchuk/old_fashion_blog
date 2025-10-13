import Loadable from "../../../components/Loadable";
import {lazy} from "react";
// import SessionRoutes from "./sessions";
// import StatusesRoutes from "./statuses";



const About = Loadable(lazy(() => import('@pages/About')));
const Home = Loadable(lazy(() => import('@pages/Home')));

const PublicRoutes = [
    { path: '/', element: <Home />, exact: true },
    { path: '/about', element: <About />, exact: true},

    // ...SessionRoutes,
    // ...StatusesRoutes,
];


export default PublicRoutes;