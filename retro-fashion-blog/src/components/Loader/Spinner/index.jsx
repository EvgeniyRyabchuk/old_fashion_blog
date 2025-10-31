// Spinner.jsx (or Spinner.js)
import React from "react";
// ⚠️ Import the SCSS file directly. This assumes your build tool
// handles SCSS imports and injects them globally.
import "./index.scss";

const Spinner = ({ style }) => (
    // Apply the global class name
    <div style={style} className="spinner-loader"></div>
);

export default Spinner;