import Loadable from "@components/Loadable";

import {lazy} from "react";
import userRole from "@/auth/roles";
import PATHS from "@/constants/paths";

const CreateEditPost = Loadable(lazy(() => import('@pages/CreateEditPost')));
// const Setting = Loadable(lazy(() => import('@pages/Setting')));


const AdminRoutes = [
    {
        path: PATHS.ADMIN_POSTS,
        element: <CreateEditPost />,
        authenticated: true,
        accessRoles: [userRole.Admin]
    },

]

export default AdminRoutes;