import React, { useState, useEffect } from "react";
import { useNavigate} from 'react-router-dom';
import { useParams } from 'react-router-dom';
import SubCluster_S from "./SubCluster_S";
import { getAuth, signOut } from "firebase/auth";
import { ExcelGenerationQueue } from './ExcelGeneration';
import { Link } from 'react-router-dom';
import './StaffSubClusters.css';
import BottomRectangle from "../page_Components/BottomRectangle";
import app from '../login_components/FirebaseConfig';

const StaffSubClusters = () => {
    //Declare navigate hook
    const navigate = useNavigate();
    const { clusterId } = useParams();
    const [subclusters, setSubclusters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openError, setOpenError] = useState(false);
    const [claim, setClaim] = useState([])
    const [claimError, setClaimError] = useState(false);

    const closeClaimError = () => {
      setClaimError(false);
    }

    const refreshPage = () => {
      window.location.reload();
  }

    //Handle the cluster click
    const handleClusterClick = (ID) => {
        console.log(ID)
    }
    
    //Route to the subcluster management page if button is clicked
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

    // Route to the cluster management page is button is clicked
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

    //Handle logout
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
    
    let user = "";
    try {
    const auth = getAuth(app);
    user = auth.currentUser;
    console.log(user.uid)
    // Make post request here
    }
    catch (error) {
      console.log(error)
    }
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

    //Handle route to admin
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

    //Grab all the subclusters to be mapped on display
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

    //Loading animation
    if (loading) {
      return<div id="loading-animation"></div>
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

    const closeError = () => {
      setOpenError(false);
      refreshPage();
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
                  <button onClick={closeClaimError}>Acknowledge</button>

                </div>
              </div>
            )

            }


            <div class="content content-margin">
                <ul id="subcluster-list">
              {subclusters.map((subcluster) => (
                <li>
                  <SubCluster_S key={subcluster.id} ID={subcluster.id} subID={subcluster.clusterID} subclusterName={subcluster.subclusterName} onClick={handleClusterClick}/>
                 </li>
                ))}
            </ul>
            </div>
            
            <BottomRectangle/>

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
              <h1>Staff View of all SubClusters</h1>
          </div>
        </div>
    )


}

export default StaffSubClusters;