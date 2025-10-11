import React, {useEffect, useState} from 'react';
import './index.scss';


const Dropdown = ({ ulClassName, data, onClick }) => {
    const [content,setContent] = useState([]);

    const render = (data) => {
        return data.map((item, index) => {
            if(item.data && item.data.length > 0) {
                console.log(item.data)
                return (
                <li
                    key={index}
                    className={`dropdown root ${onClick ? "on-click" : 'on-hover'}`}
                    onClick={onClick ? onClick : null}
                >
                    <a href={item.link} className={"side-menu-item prevent"} data-i18n={item.dataI18n}>{item.name}</a>
                    <ul className="dropdown-menu">
                        {render(item.data)}
                    </ul>
                </li>
                )
            } else if(!item.data || item.data.length === 0) {
                return (
                    <li key={index}>
                        <a href={item.link}
                           className="side-menu-item"
                           data-i18n={item.dataI18n}>
                        {item.name}
                    </a>
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