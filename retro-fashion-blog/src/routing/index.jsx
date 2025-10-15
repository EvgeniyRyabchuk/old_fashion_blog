import {Route, Routes} from "react-router-dom";
// import LayoutSuspense from "../components/Layouts";
// import AuthGuard from "../authenticated/AuthGuard";
import routes from "./routes";
import {useMemo} from "react";
import LayoutSuspense from "@components/Layout";
import AuthGuard from "@/auth/AuthGuard";


const Routing = () => {

    const routesWithAuthGuard = useMemo(() => {
        return routes.map((route) =>  {
            if(route.authenticated)
                route.element = (
                    <AuthGuard accessRoles={route.accessRoles}>
                        {route.element}
                    </AuthGuard>
                )
            return route;
        });
    }, []);

    return (
        <Routes>
            <Route
                element={<LayoutSuspense />}
                children={[
                    routesWithAuthGuard.map(route =>
                        <Route
                            path={route.path}
                            element={route.element}
                            exact={route.exact}
                        />
                    )
                ]}
            />
        </Routes>
    )
}

export default Routing
