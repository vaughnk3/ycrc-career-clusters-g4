// Imports
import React from 'react';
import BottomRectangle from '../page_Components/BottomRectangle.js';
import TopLeftLogo from '../page_Components/TopLeftLogo.js'
import DemographicBox from './DemographicBox.js';
import UserIcon from '../page_Components/UserIcon.js';
import './DemographicInfo.css';

/*
This file contains the JSX Code for the home page of the application. 
It ties together other components to comprise the home page.
Components: 
TopLeftLogo.js
UserIcon.js
DemographicBox.js
BottomRectangle.js
*/

//Define Component
const DemographicInfo = () => {
  return (
    <div id="page">

      <div id="topbar">
        <TopLeftLogo/>
        <UserIcon/>
      </div>

      <div className="content">
        <div id="demographic-content">
        <h2>To gain access to the career cluster tool,</h2>
        <h2>please enter your demographic information below</h2> 
        <h3 id="required-text" >(Fields marked with * are required)</h3>
        <DemographicBox/>
        </div>
      </div>

      <BottomRectangle/>
    </div>
  );
}

// Export completed component
export default DemographicInfo;
