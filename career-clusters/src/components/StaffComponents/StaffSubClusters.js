/*
  React component for displaying staff subclusters.

  Features:
  - Fetches subclusters data based on the cluster ID from the server.
  - Displays subclusters as clickable elements.
  - Handles user permissions for various actions.
  - Provides options for cluster management, logout, admin landing page, school management, subcluster management, and data export.
  - Displays loading animation while fetching data.
  - Displays error popup in case of fetch failure or insufficient permissions.

  LAST EDITED 04/05/2024 by Gavin T. Anderson
*/

// Imports
import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import SubCluster_S from "./SubCluster_S";
import { getAuth, signOut } from "firebase/auth";
import { ExcelGenerationQueue } from './ExcelGeneration';
import { Link } from 'react-router-dom';
import './StaffSubClusters.css';
import BottomRectangle from "../page_Components/BottomRectangle";
import app from '../login_components/FirebaseConfig';

const StaffSubClusters = () => {
    // Declare navigate hook
    const navigate = useNavigate();
    const { clusterId } = useParams(); // Get cluster ID from URL
    const [subclusters, setSubclusters] = useState([]); // State for subclusters data
    const [loading, setLoading] = useState(true); // State for loading status
    const [openError, setOpenError] = useState(false); // State for error popup
    const [claim, setClaim] = useState([]); // State for user claims
    const [claimError, setClaimError] = useState(false); // State for claim error

    // Function to close claim error popup
    const closeClaimError = () => {
      setClaimError(false);
    }

    // Function to refresh the page
    const refreshPage = () => {
      window.location.reload();
    }

    // Handle cluster click
    const handleClusterClick = (ID) => {
        console.log(ID)
    }
    
    // Route to the subcluster management page if button is clicked
    const handleSubclusterManagementClick = () => {
      if (claim.claims.claims['SubCluster Management'] == true) {
        navigate('/subclustermanagementpage');
      } else {
        setClaimError(true);
      }
    }

    // Route to the cluster management page is button is clicked
    const handleButtonClickClusterManagement = () => {
      if (claim.claims.claims['Cluster Management'] == true) {
        navigate('/login/staffclusters/clustermanagementpage');
      } else {
        setClaimError(true);
      }
    };

    // Handle logout
    const handleButtonClickLogout = async () => {
      const auth = getAuth(); // Get authentication instance
      try {
        await signOut(auth); // Sign out the user
        navigate('/login'); // Redirect to login page
      } catch(error) {
        console.error('Logout error:', error.message); // Log any errors
      }
    };
    
    let user = "";
    try {
      const auth = getAuth(app);
      user = auth.currentUser;
    } catch (error) {
      console.log(error);
    }

    // Fetch user claims
    useEffect( () => {
      const fetchUserClaims = async () => {
        try {
          const response = await(fetch('http://localhost:3001/get-unique-claims', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body:JSON.stringify({uid: user.uid}),
          }))

          if (response.ok) 
          {
            const claims = await response.json()
            setClaim(claims);
          }
        }
        catch (error) {
          console.log(error)
        }
      }
      fetchUserClaims();
    }, [])

    // Grab all the subclusters to be mapped on display
    useEffect(() => {
        const fetchSubclusters = async () => {
            try {
                const response = await fetch(`http://localhost:3001/login/staffclusters/staffsubclusters/${clusterId}`);
                if (!response.ok) {
                    throw new Error('Error fetching subclusters');
                }
                const data = await response.json();
                setSubclusters(data);
                setLoading(false);
            } catch (error) {
                console.error('Error: ', error);
                setLoading(false);
                setOpenError(true);
            }
        }

        fetchSubclusters();
    }, [clusterId])

    // Loading animation
    if (loading) {
      return <div id="loading-animation"></div>
    }
   
    // Handle school management click
    const handleSchoolManagementClick = () => {
      if (claim.claims.claims['School Management'] == true) {
        navigate('/school-management-page');
      } else {
        setClaimError(true);
      }
    }

    // Close error popup
    const closeError = () => {
      setOpenError(false);
      refreshPage();
    }

    // Handle Excel button click
    const handleExcelButtonClick = () => {
      if (claim.claims.claims['Export Excel'] == true) {
        ExcelGenerationQueue();
      } else {
        setClaimError(true);
      }
    }

    return (
        <div id="page">

           {openError && (
              <div className="popup">
                <div className="popup-content">
                  <h1>Error</h1>
                  <p>An error occurred while fetching SubClusters.</p>
                  <button onClick={closeError}>Acknowledge and Refresh</button>
                </div>
              </div>
            )}
            {claimError && (
              <div className="popup"> 
                <div className="popup-content">
                  <h1>You do not have access to this feature.</h1>
                  <p>Please contact an administrator if you believe this is an error.</p>
                  <button onClick={closeClaimError}>Acknowledge</button>
                </div>
              </div>
            )}

            <div className="content content-margin">
                <ul id="subcluster-list">
              {subclusters.map((subcluster) => (
                <li key={subcluster.id}>
                  <SubCluster_S ID={subcluster.id} subID={subcluster.clusterID} subclusterName={subcluster.subclusterName} onClick={handleClusterClick}/>
                </li>
                ))}
            </ul>
            </div>
            
            <BottomRectangle/>
          <div id="topRectangle">
          <div className="overlay">
              <Link to="/login/staffclusters"><img src={require('./HomeButton.png')} alt="Home Button" className="home-button"></img></Link>
              <div className="staff-button-column-one">
                <a className="staff-button" onClick={handleButtonClickClusterManagement}>Cluster Management</a>
                <a className="staff-button" onClick={handleButtonClickLogout}>Logout</a>
              </div>
              <div className="staff-button-column-two">
                <a className="staff-button" onClick={handleButtonClickStaff}>Admin Landing Page</a>
                <a className="staff-button" onClick={handleSchoolManagementClick}>School Management</a>
              </div>
              <div className="staff-button-column-three">
                <a className="staff-button" onClick={handleSubclusterManagementClick}>SubCluster Management</a>
                <a className="staff-button" onClick={handleExcelButtonClick}>Export Data (.xlsx)</a>
              </div>
              <div id="topTitle">
              <h2>Staff View of all Subclusters</h2>
              </div>
              </div>
          </div>
        </div>
    )
}

export default StaffSubClusters;