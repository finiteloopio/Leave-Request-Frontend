import React from "react";
import "./Spinner.css"; // We'll create this CSS file

const Spinner = ({ size = "medium" }) => {
  // Size can be 'small', 'medium', 'large'
  return <div className={`spinner spinner-${size}`}></div>;
};

export default Spinner;
