import React, {useEffect, useState} from 'react';
import './index.scss';
import {Link} from "react-router-dom";
import {useLang} from "@/context/LangContext";


const Dropdown = ({
                      ulClassName,
                      data,
                      onClick,
                      onSelected,
                      isHoverable = false,
                      isClickable = false
}) => {
    const [content,setContent] = useState([]);
    const { t, getLocCatName } = useLang();

    const render = (data) => {
        return data.map((item, index) => {
            if(item.data && item.data.length > 0) {
                console.log(item.data)
                return (
                    <li key={index}
                        className={`dropdown root ${onClick ? "on-click" : 'on-hover'}`}
                        onClick={(e) => {
                            if(isHoverable) onSelected(item.link);
                            if(isClickable) onClick(e);
                        }}
                    >
                        <a  href={item.link}
                            className={"side-menu-item prevent"}
                            data-i18n={item.dataI18n}
                            onClick={(e) => e.preventDefault() }
                        >
                            {t(item.dataI18n)}
                        </a>
                        <ul className="dropdown-menu">
                            {render(item.data)}
                        </ul>
                    </li>
                )
            } else if(!item.data || item.data.length === 0) {
                return (
                    <li key={index} onClick={(e) => {
                        e.stopPropagation();
                        onSelected(item.link);
                    }}>
                        <a href={item.link}
                           className="side-menu-item"
                           data-i18n={item.dataI18n}
                           onClick={(e) => e.preventDefault()}
                        >
                            {t(item.dataI18n)}
                        </a>
                    </li>
                )
            }
        })
    }

    useEffect(() => {
        const res = render(data);
        setContent(res);
    }, [data])

    return (
        <ul className={ulClassName}>
            {content.map(li => (li))}
        </ul>
    );
};

export default Dropdown;