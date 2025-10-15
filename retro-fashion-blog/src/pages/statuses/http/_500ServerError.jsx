import React from 'react';
import StatusWrapper from "@pages/statuses";

const _500ServerError = () => {
    return (
        <StatusWrapper>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5' }}>
                <div style={{ textAlign: 'center', padding: '2rem', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
                    <h1 style={{ fontSize: '4rem', color: '#e74c3c', margin: 0 }}>500</h1>
                    <h2 style={{ color: '#2c3e50', marginTop: '1rem' }}>Server Error</h2>
                    <p style={{ color: '#7f8c8d', marginTop: '1rem' }}>Sorry, there was an error with our server. Please try again later.</p>
                    <button
                        onClick={() => window.location.reload()}
                        style={{
                            backgroundColor: '#3498db',
                            color: 'white',
                            border: 'none',
                            padding: '10px 20px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            marginTop: '1rem'
                        }}
                    >
                        Refresh Page
                    </button>
                </div>
            </div>
        </StatusWrapper>

    );
};

export default _500ServerError;