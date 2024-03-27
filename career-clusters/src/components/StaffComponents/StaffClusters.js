import './StaffClusters.css';
import React from 'react';
import {useNavigate, Link } from 'react-router-dom';
import './OverlayRectangle.css'
import { useState , useEffect} from "react";
import Cluster_S from "./Cluster_S";
import BottomRectangle from "../page_Components/BottomRectangle";
import { getAuth, signOut } from "firebase/auth";
import './StaffClusters.css'
import { ExcelGenerationQueue } from './ExcelGeneration';
import SchoolManagementPage from './ManagementPages/SchoolManagementPage';
import app from '../login_components/FirebaseConfig';

const StaffClusters = () => {

    const navigate = useNavigate();
    const [clusters, setClusters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const [claim, setClaim] = useState([])
    const [claimError, setClaimError] = useState(false);


    const closeError = () => {
      setClaimError(false);
    }


    const closePopup = () => {
      setIsOpen(false);
      window.location.reload();
    }
    

    useEffect(() => {
        const fetchClusters = async () => {
            try {
                const response = await (fetch('http://localhost:3001/login/staffclusters'));
                if(!response.ok) {
                    throw new Error('Error fetching clusters');
                }
                const data = await response.json();
                setClusters(data);
                setLoading(false);
            } catch (error) {
                setLoading(false);
                setIsOpen(true);
                console.error('Error: ', error);
            }
        }
        fetchClusters();
    }, []);

    let user = ""
    try {
    const auth = getAuth(app);
    user = auth.currentUser;
    console.log(user.uid)
    }catch(error) {
      console.log("error")
    }
    // Make post request here

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

    if (loading) {
      return <div id="loading-animation"></div>
    }

  const handleClusterClick = (ID) => {
      console.log(ID)
      navigate(`/login/staffclusters/staffsubclusters/${ID}`);
      return ID;
  }

  const handleFormSubmit =(e) => {
    e.preventDefault();
    navigate('/cluster/subcluster')
  }

  const handleButtonClickClusterManagement = () => {
    console.log(claim.claims.claims['Cluster Management'])
    if (claim.claims.claims['Cluster Management'] == true)
    {
      navigate('/login/staffclusters/clustermanagementpage');
    }
    else {
      console.log("In the else")
      setClaimError(true);
      //navigate('/login/staffclusters');
      
    }
    //navigate('/login/staffclusters/clustermanagementpage');
  };
  const handleButtonClickLogout = async () => {
    //Logout
    const auth = getAuth();
    try {
      await signOut(auth);
      console.log("Logout.");
      navigate('/login');
    } catch(error) {
      console.error('Logout error:', error.message);
    }
  };
  
  
  
  const handleButtonClickStaff = () => {
    //Need to check whether or not user has correct permissions. 
    console.log(claim.claims.claims['Administrator'])
    if (claim.claims.claims['Administrator'] == true)
    {
      navigate('/login/adminpage');
    }
    else {
      console.log("In the else")
      setClaimError(true);
      //navigate('/login/staffclusters');
      
    }
    //navigate('/login/staffclusters/clustermanagementpage');

  };

  const handleSubclusterManagementClick = () => {
    console.log(claim.claims.claims['SubCluster Management'])
    if (claim.claims.claims['SubCluster Management'] == true)
    {
      navigate('/subclustermanagementpage');
    }
    else {
      console.log("In the else")
      setClaimError(true);
      //navigate('/login/staffclusters');
      
    }
    //navigate('/login/staffclusters/clustermanagementpage');
  }

  const handleSchoolManagementClick = () => {
    console.log(claim.claims.claims['School Management'])
    if (claim.claims.claims['School Management'] == true)
    {
      navigate('/school-management-page');
    }
    else {
      console.log("In the else")
      setClaimError(true);
      //navigate('/login/staffclusters');
      
    }
  }

    const handleExcelButtonClick = () => {
      console.log(claim.claims.claims['Export Excel'])
      if(claim.claims.claims['Export Excel'] == true){
        ExcelGenerationQueue();
      }
      else{
        console.log("In the else")
        setClaimError(true);
      }
    }

    return (
        <div id="page">
          {isOpen && (
          <div className="popup">
            <div className="popup-content">
              <h1>Error</h1>
              <p>An error occurred while fetching clusters.</p>
              <button onClick={closePopup}>Acknowledge and Refresh</button>
            </div>
          </div>
        )}
        { claimError && (
          <div className="popup">
            <div className="popup-content">
              <h1>You do not have access to this feature.</h1>
              <button onClick={closeError}>Acknowledge</button>
            </div>
          </div>
        )}
        <div class="content content-margin">
          <li id="c_array">
                {clusters.map(cluster => (
                <form id="form1" onSubmit={handleFormSubmit}>
                    <Cluster_S key={cluster.id} id={cluster.id} clusterName={cluster.clusterName} onClick={handleClusterClick}/>
                </form>
                ))}
            </li>
            </div>
            <div id="topRectangle">
          <div className="overlay">
            <Link to="/login/staffclusters"><img src={require('./HomeButton.png')} alt="Home Button" className="home-button"></img></Link>
            <div class="staff-button-column-one">
              <a class="staff-button" onClick={handleButtonClickClusterManagement}>Cluster Management</a>
              <a class="staff-button" onClick={handleButtonClickLogout}>Logout</a>
            </div>
            <div class="staff-button-column-two">
              <a class="staff-button" onClick={handleButtonClickStaff}>Admin Landing Page</a>
              <a class="staff-button" onClick={handleSchoolManagementClick}>School Management</a>
            </div>
            <div class="staff-button-column-three">
              <a class="staff-button" onClick={handleSubclusterManagementClick}>SubCluster Management</a>
              <a class="staff-button" onClick={handleExcelButtonClick}>Export Data (.xlsx)</a>
            </div>
            <div id="topTitle">
            <h2>Staff View of all Clusters</h2>
            </div>
            </div>
          </div>
          <BottomRectangle/>
        </div>
    )
}


export default StaffClusters;

