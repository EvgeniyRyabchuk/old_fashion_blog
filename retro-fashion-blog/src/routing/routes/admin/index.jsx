import Loadable from "../../../components/Loadable";
import userRole from "../../../auth/roles";
import {lazy} from "react";

const CreateEditPost = Loadable(lazy(() => import('@pages/CreateEditPost')));
const Setting = Loadable(lazy(() => import('@pages/Setting')));


const CreatorRoutes = [
    {
        path: '/CreateEditPost',
        element: <CreateEditPost />,
        exact: true,
        authenticated: true,
        accessRoles: [userRole.Creator]
    },
    {
        path: '/setting',
        element: <Setting />,
        exact: true,
        authenticated: true,
        accessRoles: [userRole.Creator]
    }
]

export default CreatorRoutes;