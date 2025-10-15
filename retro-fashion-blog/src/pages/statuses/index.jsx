import React from 'react';

const StatusWrapper = ({ children }) => {
    return (
        <div style={{ height: "500px", padding: '2rem' }}>
            {children}
        </div>
    );
};

export default StatusWrapper;