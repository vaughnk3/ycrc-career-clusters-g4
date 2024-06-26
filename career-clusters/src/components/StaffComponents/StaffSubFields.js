/*
  React component for displaying staff subfields.

  Features:
  - Fetches subfields data based on the subcluster ID from the server.
  - Displays subfield information such as name, description, average salary, education level, and growth rate.
  - Handles user permissions for various actions.
  - Provides options for cluster management, logout, admin landing page, school management, subcluster management, and data export.
  - Displays error popup in case of fetch failure or insufficient permissions.

  LAST EDITED 04/05/2024 by Gavin T. Anderson
*/

// Import necessary components, libraries, and styles
import BottomRectangle from "../page_Components/BottomRectangle";
import './StaffSubFields.css';
import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import { ExcelGenerationQueue } from './ExcelGeneration';
import { Link } from 'react-router-dom';
import './StaffSubClusters.js';
import app from '../login_components/FirebaseConfig';

// StaffSubFields component declaration
const StaffSubFields = () => {
  // Retrieve subclusterId from URL parameters
  const { subclusterId } = useParams();
  // State variables
  const [subFields, setSubFields] = useState([]);
  const [claim, setClaim] = useState([]);
  const [claimError, setClaimError] = useState(false);

  // Fetch subfields data from the server based on subclusterId
  useEffect(() => {
    const fetchSubFields = async () => {
      try {
        const response = await fetch(`http://localhost:3001/login/staffclusters/staffsubclusters/staffsubclusterinfo/${subclusterId}`);
        if (!response.ok) {
          throw new Error('Error fetching subcluster info');
        }
        const data = await response.json();
        setSubFields(data);
      } catch (error) {
        console.error('Error: ', error);
      }
    }
    fetchSubFields();
  }, [subclusterId]);

  // Function to close claim error popup
  const closeClaimError = () => {
    setClaimError(false);
  };

  // Navigate hook for forceful navigation
  const navigate = useNavigate();

  // Function to handle click event for navigating to the subcluster management page
  const handleSubclusterManagementClick = () => {
    if (claim.claims.claims['SubCluster Management'] === true) {
      navigate('/subclustermanagementpage');
    } else {
      setClaimError(true);
    }
  };

  // Function to handle click event for navigating to the cluster management page
  const handleButtonClickClusterManagement = () => {
    if (claim.claims.claims['Cluster Management'] === true) {
      navigate('/login/staffclusters/clustermanagementpage');
    } else {
      setClaimError(true);
    }
  };

  // Function to handle logout
  const handleButtonClickLogout = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error.message);
    }
  };

  // Variable to store authenticated user's UID
  let user = "";
  try {
    const auth = getAuth(app);
    user = auth.currentUser;
  } catch (error) {
    console.log(error);
  }

  // Fetch user claims data based on UID
  useEffect(() => {
    const fetchUserClaims = async () => {
      try {
        const response = await fetch('http://localhost:3001/get-unique-claims', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ uid: user.uid }),
        });
        if (response.ok) {
          const claims = await response.json();
          setClaim(claims);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchUserClaims();
  }, []);

  // Function to handle click event for navigating to the admin landing page
  const handleButtonClickStaff = () => {
    if (claim.claims.claims['Administrator'] === true) {
      navigate('/login/adminpage');
    } else {
      setClaimError(true);
    }
  };

  // Function to handle click event for navigating to the school management page
  const handleSchoolManagementClick = () => {
    if (claim.claims.claims['School Management'] === true) {
      navigate('/school-management-page');
    } else {
      setClaimError(true);
    }
  };

  // Function to handle click event for generating Excel data
  const handleExcelButtonClick = () => {
    if (claim.claims.claims['Export Excel'] === true) {
      ExcelGenerationQueue();
    } else {
      setClaimError(true);
    }
  };

  // Retrieve the first subfield from subFields array
  const field = subFields.length > 0 ? subFields[0] : {};

  // Initialize variable to store the display content
  let displayWords = [];

  try {
    // Make sure that field and schoolList is defined
    if (field && field.schoolList) {
      // Split the text into an array of words
      const arrayOfSchoolWords = field.schoolList.split(/\s+/);
      
      // Map each word accordingly. 
      displayWords = arrayOfSchoolWords.map((item, index) => {
        // If the word is really a link, return an <a> tag with the reference link and open in a new tab.  
          if (item.startsWith('http') || item.startsWith('www') || item.includes('://')) {
              return(
                  <a key={index} href={item} target="_blank" rel="noopener noreferrer">
                      {item}
                      <br></br><br></br>
                  </a>
                  
              )
          }
          // If it is just a normal word, return the word with breaks for spacing.  
          else {
              return <span key={index}> {item} </span>
          }
      })
    }
  }
  catch (error) {
    console.log(error);
  }

  // Render JSX content
  return (
    <div id="page">
      {claimError && (
        <div className="popup">
          <div className="popup-content">
            <h1>You do not have access to this feature.</h1>
            <p>Please contact an administrator if you believe this is an error.</p>
            <button onClick={closeClaimError}>Acknowledge</button>
          </div>
        </div>
      )}
      <div id="_topRectangle">
                
                <div className="overlay">
                <div class="management-header">
                    <div class="management-button-header">
                        <Link to="/login/staffclusters">
                            <img src={require('./HomeButton.png')} alt="Home Button" className="home-button" />
                        </Link>
                    </div>                       
                    <div class="management-button-header">
                        <a className="management-header-button " onClick={handleButtonClickStaff}>
                            Admin Landing Page
                        </a>
                        <a className="management-header-button " onClick={handleSchoolManagementClick}>
                            School Management
                        </a>
                    </div>
                    <div class="management-header-text">
                        <h2>Staff View of Subcluster Fields</h2>
                    </div>
                    <div class="management-button-header">
                        <a className="management-header-button" onClick={handleButtonClickClusterManagement}>
                            Cluster Management
                        </a>
                        <a className="management-header-button" onClick={handleButtonClickLogout}>
                            Logout
                        </a>
                    </div>
                    <div class="management-button-header">
                        <a className="management-header-button " onClick={handleSubclusterManagementClick}>
                            SubCluster Management
                        </a>
                        <a className="management-header-button " onClick={handleExcelButtonClick}>
                            Export Data (.xlsx)
                        </a>
                    </div>
                    
                </div>
            </div>
        </div>
      <div className="content content-margin">
        <div id="subfield-content">
          <div id="row">
            <div id="topLeft">
              <h2 id="fName">{field.fieldName}</h2>
              <h2 id="fDesc">{field.description} </h2>
            </div>
            <a id="view-button" href="https://business.yorkcountychamber.com/jobs" target="_blank" rel="noopener noreferrer">View Job Postings</a>
          </div>
          <div id="bottomMiddle">
            <div className="field-statistic">
              <h2>Average Salary</h2>
              <h1> ${field.avgSalary} </h1>
            </div>
            <div className="field-statistic">
              <h2>Education Level</h2>
              <h1>{field.educationLvl}</h1>
            </div>
            <div className="field-statistic">
              <h2>Growth Rate</h2>
              <h1>{field.growthRate}</h1>
            </div>
            <div class="field-statistic">
                <h2>Higher Education Opportunities</h2>
                <br></br>
                <div>{displayWords}</div>
            </div>
          </div>
        </div>
      </div>
      <BottomRectangle/>
    </div>
  );
};

export default StaffSubFields;