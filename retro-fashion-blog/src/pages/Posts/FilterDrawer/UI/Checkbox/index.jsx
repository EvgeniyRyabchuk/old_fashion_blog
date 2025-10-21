import React from 'react';
import './index.scss';

const Checkbox = ({value, name, datasetType, onSelect}) => {
    return (
        <label className={`checkbox-container ${datasetType}`}  >
            <input
                type="checkbox"
                value={value}
                data-type={datasetType}
                onChange={onSelect}
            />
            {name}
        </label>
    )
}

export default Checkbox;