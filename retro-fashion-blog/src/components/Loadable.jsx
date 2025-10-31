import React, {Suspense} from 'react';
import {StandardLoader} from "@components/Loader";



export const PageLoader = (
    <div style={{ position: "relative", top: '100px'}}>
        <StandardLoader isActive={true} />
    </div>
)

export const PageLoaderElement = () => {
    return (
        <div style={{
            position: "absolute",
            top: '0',
            left: '0',
            right: '0',
            bottom: '0',
            zIndex: '999',
            // backgroundColor: 'red'
        }}>
            <StandardLoader isActive={true} />
        </div>
    )
}

const Loadable = (Component) => (props) => {
    return (
        <>
            <Suspense fallback={<PageLoaderElement/>}>
                <Component {...props} />
            </Suspense>
        </>
    );
};

export default Loadable;