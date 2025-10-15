import React, {useEffect, useState} from 'react';
import './index.scss';
import {Link, useNavigate} from "react-router-dom";


const Dropdown = ({ ulClassName, data, onClick }) => {
    const [content,setContent] = useState([]);
    const navigate = useNavigate();

    const render = (data) => {
        return data.map((item, index) => {
            if(item.data && item.data.length > 0) {
                console.log(item.data)
                return (
                <li
                    key={index}
                    className={`dropdown root ${onClick ? "on-click" : 'on-hover'}`}
                    onClick={() => {
                        onClick && onClick();
                        navigate(item.link);
                    }}
                >
                    <Link to={item.link} className={"side-menu-item prevent"} data-i18n={item.dataI18n}>{item.name}</Link>
                    <ul className="dropdown-menu">
                        {render(item.data)}
                    </ul>
                </li>
                )
            } else if(!item.data || item.data.length === 0) {
                return (
                    <li key={index} onClick={() =>  navigate(item.link)}>
                        <Link to={item.link}
                           className="side-menu-item"
                           data-i18n={item.dataI18n}>
                        {item.name}
                        </Link>
                    </li>
                )
            }
        })
    }

    useEffect(() => {
        const res = render(data);
        // console.log(res)
        setContent(res);
    }, [])

    return (
        <ul className={ulClassName}>
            {content.map(li => (li))}
        </ul>
    );
};

export default Dropdown;