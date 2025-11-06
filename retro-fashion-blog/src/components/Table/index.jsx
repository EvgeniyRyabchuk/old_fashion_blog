import React from 'react';
import './index.scss';
import {HtmlContent} from "@utils/helper";


import staticRows from './static-rows.json';


const Td = ({ col, row, index }) => {
    console.log('td')
    const getContent = () => {
        const content = row[col.key];
        const type = col.type;

        if(type === "img")
            return <img src={content} width={100} height={100} />

        if(type === "html")
            return <HtmlContent html={content}/>

        if(type === "largeText")
            return <div className="td-content">{content}</div>

        if(type === "text" || !type || type === "" || type === "actions")
            return content;
    }

    return (
        <td >
            {getContent()}
        </td>
    )
}

const Table = ({ cols, rows, onRowClick }) => {
    return (
        <div className="table-wrapper">
            <table id="postsTable">
                <thead>
                    <tr>
                        { cols && cols.map((col, i) => (
                                <th key={i} data-i18n={col.dataI18n}>{col.name}</th>
                            ))
                        }
                    </tr>
                </thead>
                <tbody id="postTableBody">
                    { rows && rows.map((row, i) => (
                        <tr key={row.id} onClick={() => onRowClick(row)}>
                            {/*{console.log(row.id)}*/}
                            { cols.map((col, i) => (
                                <Td key={`${row.id}-${col.key}`} index={i} col={col} row={row} />
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};


export default Table;