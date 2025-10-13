import React, {Suspense} from 'react';
import Loader from "@components/Loader";


export const PageLoader = (
    <div style={{ position: "relative", top: '100px'}}>
        <Loader active={true} />
    </div>
)

export const PageLoaderElement = () => {
    return (
        <div style={{
            position: "fixed",
            top: '50%',
            left: '50%',
            zIndex: '999'
        }}>
            <Loader active={true} />
        </div>
    )
}

const Loadable = (Component) => (props) => {
    return (
        <div>
            <Suspense fallback={PageLoader}>
                <Component {...props} />
            </Suspense>
        </div>
    );
};

export default Loadable;