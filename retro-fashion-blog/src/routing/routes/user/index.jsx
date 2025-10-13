
import Loadable from "../../../components/Loadable";
import {lazy} from "react";
import userRole from "@/auth/roles";



const ClientRoutes = [
    {
        path: '/favorites',
        element: (<div>favorites</div>),
        exact: true,
        authenticated: true,
        accessRoles: [userRole.User]
    },

]

export default ClientRoutes;