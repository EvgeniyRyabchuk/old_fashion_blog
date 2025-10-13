import React from 'react';
import Home from "@pages/Home";
import './index.scss';

const Main = ({ children }) => {
    return (
        <div className="main-wrapper">
            <main>
                {children}
            </main>
        </div>
    );
};

export default Main;