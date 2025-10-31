import React, {useEffect} from 'react';
import {Outlet} from "react-router-dom";

import Header from "@components/Layout/StandardLayout/Header";
import Footer from "@components/Layout/StandardLayout/Footer";
import Main from "@components/Layout/StandardLayout/Main";

const Invisible = () => (<div style={{visibility: "hidden"}}>dsf</div>)

const StandartLayout = () => {
    return (
        <div>
            <Header/>

            <Main>
                <Invisible />
                <Outlet />
            </Main>

            <Footer />
        </div>
    );
};

export default StandartLayout;