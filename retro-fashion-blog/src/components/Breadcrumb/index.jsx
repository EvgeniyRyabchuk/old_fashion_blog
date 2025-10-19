import React from 'react';
import './index.scss';
import {Link} from "react-router-dom";

const Breadcrumb = ({ isOpen = true, items }) => {


    return (
        <nav id="breadcrumbs" className={`${!isOpen && "d-none"} breadcrumbs`}>
            <ul>
                {items.map((item, index) => (
                    <span key={index}>
                      {item.to ? (
                          <Link to={item.to}>{item.label}</Link>
                      ) : (
                          <span>{item.label}</span>
                      )}
                        {index < items.length - 1 && " / "}
                    </span>
                ))}
            </ul>
        </nav>
    );
};

export default Breadcrumb;