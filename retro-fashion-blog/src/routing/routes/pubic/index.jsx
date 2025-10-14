import Loadable from "../../../components/Loadable";
import {lazy} from "react";
import About from "@pages/About";
import Home from "@pages/Home";

// import SessionRoutes from "./sessions";
// import StatusesRoutes from "./statuses";



// const About = Loadable(lazy(() => import('@pages/About')));
// const Home = Loadable(lazy(() => import('@pages/Home')));
const AuthForm = Loadable(lazy(() => import('@pages/AuthForm')));


const PublicRoutes = [
    { path: '/', element: <Home />, exact: true },
    { path: '/about', element: <About />, exact: true},
    { path: '/login', element: <AuthForm isAccountExist={true} />, exact: true},
    { path: '/sign-up', element: <AuthForm isAccountExist={false} />, exact: true},

    // ...SessionRoutes,
    // ...StatusesRoutes,
];


export default PublicRoutes;