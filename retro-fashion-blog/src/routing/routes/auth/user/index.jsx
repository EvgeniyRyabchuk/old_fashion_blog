
import Loadable from "@components/Loadable";
import {lazy} from "react";
import userRole from "@/auth/roles";
import PATHS from "@/constants/paths";


const ClientRoutes = [
    {
        path: PATHS.FAVORITES,
        element: (<div>favorites</div>),
        exact: true,
        authenticated: true,
        accessRoles: [userRole.User]
    },

]

export default ClientRoutes;