import React from "react";
import './TopLeftLogo.css';
import { Link } from 'react-router-dom';

// Component for the logo button in the top left corner of demographic information and login pages.
const TopLeftLogo = () => {
    return <Link to="/"><img src={require('./YorkLogo.png')} alt="YCRC Logo" className="top-left-image"></img></Link>
}

//Export component
export default TopLeftLogo;