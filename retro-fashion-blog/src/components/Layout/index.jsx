import React, {Fragment, useEffect, useMemo, useState} from 'react';
import { Suspense } from 'react';
import Loader from "@components/Loader";


const LoaderScreen = () => {

    return (
        <div
            style={{ position: "absolute",
                top: 0, left: 0, right: 0, bottom: 0, 
                background: "grey" }}>
            <h1>Loading</h1>
            <Loader isActive={true} />
        </div>
    )
}

const StandardLayout =
    React.lazy(() => import('./StandardLayout'));

const isAuth = true;
const user = {
    name: "John Doe",
    role: {
        name: "admin"
    },
}
const LayoutSuspense = () => {

    const [layout, setLayout] = useState(null);

    const selectLayout = () => {
        if(isAuth && user
            && user.role.name === "admin")
            setLayout(<StandardLayout />);

        else if(isAuth && user
            && user.role.name === "Admin")
            setLayout(<StandardLayout />);

        else if(!isAuth)
            setLayout(<StandardLayout />);
    }

    useEffect(() => {
        selectLayout();
    }, [])

    const suspenseLayout = useMemo(() => {
        if (layout === null) return (<Fragment>123</Fragment>);
        return (
            <Suspense fallback={<LoaderScreen />}>
                {layout}
            </Suspense>
        )

    }, [layout]);

    return (
        <>
            {suspenseLayout}
        </>
    );
};

export default LayoutSuspense;
