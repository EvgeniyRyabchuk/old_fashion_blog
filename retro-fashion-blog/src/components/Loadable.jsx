import React, {Suspense} from 'react';
import {StandardLoader} from "@components/Loader";



export const PageLoader = (
    <div style={{ position: "relative", top: '100px'}}>
        <StandardLoader active={true} />
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
            backgroundColor: 'red'
        }}>
            <StandardLoader active={true} />
        </div>
    )
}

const Loadable = (Component) => (props) => {
    return (
        <div>
            <Suspense fallback={PageLoaderElement}>
                <Component {...props} />
            </Suspense>
        </div>
    );
};

export default Loadable;