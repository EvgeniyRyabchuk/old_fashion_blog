import React from 'react';
import './index.scss';

const Breadcrumb = () => {


    return (
        <nav id="breadcrumbs" className="d-none breadcrumbs">
            <ul>
                <li>
                    <a href="/">Home</a>
                    <span>/</span>
                </li>
                <li>
                    <a href="/">Products</a>
                    <span>/</span>
                </li>
                <li>
                    <a href="/">Categories</a>
                    <span>/</span>
                </li>
            </ul>
        </nav>
    );
};

export default Breadcrumb;