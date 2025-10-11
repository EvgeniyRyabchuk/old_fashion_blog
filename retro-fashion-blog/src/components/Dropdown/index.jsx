import React, {useEffect, useState} from 'react';
import './index.scss';


const Dropdown = ({ ulClassName, data }) => {
    const [content,setContent] = useState([]);

    const render = (data) => {
        return data.map((item) => {
            if(item.data && item.data.length > 0) {
                console.log(item.data)
                return (
                <li className="dropdown on-hover root">
                    <a href={item.link} className="dropdown-toggle" data-i18n={item.dataI18n}>{item.name}</a>
                    <ul className="dropdown-menu">
                        {render(item.data)}
                    </ul>
                </li>
                )
            } else if(!item.data || item.data.length === 0) {
                return (
                    <li><a href={item.link}
                           className="dropdown-item"
                           data-i18n={item.dataI18n}>
                        {item.name}</a>
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