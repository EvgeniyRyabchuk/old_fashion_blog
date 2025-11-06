import Loadable from "@components/Loadable";

import {lazy} from "react";
import userRole from "@/auth/roles";
import PATHS from "@/constants/paths";

const CreateEditPost = Loadable(lazy(() => import('@pages/CreateEditPost')));
const Messages = Loadable(lazy(() => import('@pages/Messages')));
const Comments = Loadable(lazy(() => import('@pages/Comments')));
// const Setting = Loadable(lazy(() => import('@pages/Setting')));


const AdminRoutes = [
    {
        path: PATHS.ADMIN_POSTS,
        element: <CreateEditPost />,
        authenticated: true,
        accessRoles: [userRole.Admin]
    },
    {
        path: PATHS.ADMIN_MESSAGES,
        element: <Messages />,
        authenticated: true, 
        accessRoles: [userRole.Admin]
    },
    {
        path: PATHS.ADMIN_COMMENTS,
        element: <Comments />,
        authenticated: true,
        accessRoles: [userRole.Admin]
    },
]

export default AdminRoutes;