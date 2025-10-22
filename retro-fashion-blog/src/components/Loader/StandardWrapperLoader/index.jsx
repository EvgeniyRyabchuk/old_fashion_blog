import React, {useState} from 'react';
import './index.scss';
import {StandardLoader} from "@components/Loader";

const StandardWrapperLoader = ({ ...props }) => {
    return (
        <div className="st-wr-loader" {...props}>
            <StandardLoader isActive={true}/>
        </div>
    );
};

export default StandardWrapperLoader;