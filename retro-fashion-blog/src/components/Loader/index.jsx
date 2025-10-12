import React, {useState} from 'react';
import './index.scss';

const Loader = ({ isActive }) => {

    return (
        <div id="searchPostLoader"
             className={`loader-wrapper abs bg-transparent ${isActive ? "flex" : "d-none"} `}>
            <div className={`loader`}>
                <div className="circle-wrapper-1">
                    <div className="circle-1"></div>
                </div>
                <div className="circle-wrapper-2">
                    <div className="circle-2"></div>
                </div>
                <div className="circle-wrapper-3">
                    <div className="circle-3"></div>
                </div>
                <div className="circle-wrapper-4">
                    <div className="circle-4"></div>
                </div>
                <div className="circle-wrapper-5">
                    <div className="circle-5"></div>
                </div>
                <div className="circle-wrapper-6">
                    <div className="circle-6"></div>
                </div>
            </div>
        </div>
    );
};

export default Loader;