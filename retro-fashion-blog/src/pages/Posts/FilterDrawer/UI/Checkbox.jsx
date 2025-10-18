import React from 'react';

const Checkbox = ({value, name, datasetType, onSelect}) => {
    return (
        <label>
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