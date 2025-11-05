import Loadable from "../../../components/Loadable";
import {lazy} from "react";
import About from "@pages/About";
import Home from "@pages/Home";
import SessionRoutes from "@/routing/routes/pubic/sessions";
import StatusesRoutes from "@/routing/routes/pubic/statuses";
import PATHS from "@/constants/paths";

const PostsPage = lazy(() => import("@pages/Posts"));
const PostPage = lazy(() => import("@pages/Post"));
const Contact = lazy(() => import("@pages/Contact"));

const PublicRoutes = [
    { path: PATHS.HOME, element: <Home />, exact: true },
    { path: PATHS.ABOUT, element: <About />, exact: true},
    { path: PATHS.CONTACT, element: <Contact />, exact: true},
    { path: PATHS.POSTS, element: <PostsPage />, exact: true},
    { path: PATHS.POST(":postId"), element: <PostPage />, exact: true},

    ...SessionRoutes,
    ...StatusesRoutes
];


export default PublicRoutes;