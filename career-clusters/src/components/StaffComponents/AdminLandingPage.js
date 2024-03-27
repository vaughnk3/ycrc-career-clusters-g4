import BottomRectangle from "../page_Components/BottomRectangle";
import "./AdminLandingPage.css";
import { ExcelGenerationQueue } from "./ExcelGeneration";
import { getAuth, getIdToken, signOut } from "firebase/auth";
import {useNavigate} from 'react-router-dom';
import { useState } from "react";
import app from "../login_components/FirebaseConfig";



const AdminLandingPage = () => {
    const navigate = useNavigate();
    const [openClusterWipe, setClusterWipe] = useState(false);
    const [openSubClusterWipe, setSubClusterWipe] = useState(false);
    const [openDemographicWipe, setDemographicWipe] = useState(false);
    const [message, setMessage] = useState('');
    const [confirmPopup, setConfirmPopup] = useState(false);

    const auth = getAuth(app);

    const closePopup = () => {
        setConfirmPopup(false);
    }

    const openCluster = () => {
        setClusterWipe(true);
    }
    const closeCluster = () => {
        setClusterWipe(false);
    }

    const openSubCluster = () => {
        setSubClusterWipe(true);
    }
    const closeSubCluster = () => {
        setSubClusterWipe(false);
    }

    const openDemographic = () => {
        setDemographicWipe(true);
    }

    const closeDemographic = () => {
        setDemographicWipe(false);
    }


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


    const handleWipeClusterCounts =  async  () => {
        try {
        
            const user = auth.currentUser;
            if (user) {
                //Download excel file before the info is wiped.
                ExcelGenerationQueue();

                const token = await user.getIdToken();
                const response = await(fetch('http://localhost:3001/wipe-cluster-clickCounts',  {
                    method: 'POST', 
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                }))
                if (response.ok) 
                {
                    closeCluster();
                    setMessage('Successfully cleared Cluster Click Counts.');
                    setConfirmPopup(true);
                }

                else 
                {
                    closeCluster();
                    setMessage('Failed to clear Cluster Click Counts.');
                    setConfirmPopup(true);
                }
                
            }
        } catch(error) {
            console.log(error);
            closeCluster();
            setMessage('Failed to clear Cluster Click Counts.');
            setConfirmPopup(true);
        }

        
    }

    const handleWipeSubClusterCounts = async () => {
        try {
            const user = auth.currentUser;

            if (user) {
                //Download excel file before the info is wiped.
                ExcelGenerationQueue();

                const token = await user.getIdToken();

                const response = await(fetch('http://localhost:3001/wipe-subcluster-clickCounts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
                }))

                if(response.ok) 
                {
                    closeSubCluster();
                    setMessage('Successfully cleared SubCluster Click Counts.');
                    setConfirmPopup(true);
                }
                else
                {
                    closeSubCluster();
                    setMessage('Failed to clear SubCluster Click Counts.');
                    setConfirmPopup(true);
                }
            }
        } catch (error) {
            console.log(error)
            closeSubCluster();
            setMessage('Failed to clear SubCluster Click Counts.');
            setConfirmPopup(true);
        }

        
    }


    const handleWipeDemographicInfo = async () => {
        try {
            const user = auth.currentUser;

            if (user) {
                //Download excel file before info is wiped
                ExcelGenerationQueue();
                
                const token = await user.getIdToken();
                const response = await(fetch('http://localhost:3001/wipe-demographic-counts', {
                method: 'POST', 
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
                }))

                if (response.ok)
                {
                    closeDemographic();
                    setMessage('Successfully cleared Demographic Information.');
                    setConfirmPopup(true);
                }
                else 
                {
                    closeDemographic();
                    setMessage('Failed to clear Demographic Information.');
                    setConfirmPopup(true);
                }
            }
        } catch (error) {
            console.log(error)
            closeDemographic();
            setMessage('Failed to clear Demographic Information.');
            setConfirmPopup(true);
        }

    }
    
    return (
        <div id="page">
            <div id="_topRectangle">
                <h1>Administrator Landing Page</h1>
            </div>
            <div class="content content-margin admin-landing-content">
                <div id="admin-landing-buttons">
                <div class="admin-landing-column">

                    {confirmPopup && (
                        <div className="popup">
                            <div className="popup-content">
                                <h1>{message}</h1>
                                <button onClick={closePopup}>Acknowledge</button>
                            </div>
                        </div>
                    )}


                    <a href="/login/adminpage/createstaffpage">Create Staff Account</a>
                    <a href="/login/staffclusters">Staff Cluster View</a>
                    <a href="/subclustermanagementpage">SubCluster Management</a>
                    <a onClick={openCluster} >Clear Cluster Click Counts</a>
                    <a onClick={openDemographic}>Clear Demographic Information Data</a>
                    {openClusterWipe && (
                        <div className="popup">
                            <div className="popup-content">
                                <h1>Are you sure you want to clear Cluster Click Rates?</h1>
                                <p>This action is irreversible.</p>
                                <button onClick={handleWipeClusterCounts}>Clear Click Rates</button>
                                <button onClick={closeCluster}>Cancel</button>
                            </div>
                        </div>
                    )}
                    
                    {openDemographicWipe && (
                        <div className="popup">
                            <div className="popup-content">
                                <h1>Are you sure you want to clear stored Demographic Information?</h1>
                                <p>This action is irreversible.</p>
                                <button onClick={handleWipeDemographicInfo}>Clear Demographic Info</button>
                                <button onClick={closeDemographic}>Cancel</button>
                            </div>
                        </div>
                    )}
                </div>
                <div class="admin-landing-column">
                    <a href="/login/adminpage/modifyperms">Modify User Permissions</a>
                    <a href="/login/staffclusters/clustermanagementpage">Cluster Management</a> 
                    <a href="https://business.yorkcountychamber.com/jobs">View Job Postings</a>
                    <a onClick={openSubCluster} >Clear SubCluster Click Counts</a>
                    <a  onClick={ExcelGenerationQueue}>Export Data (.xlsx)</a>
                    {openSubClusterWipe && (
                        <div className="popup">
                            <div className="popup-content">
                                <h1>Are you sure you want to clear SubCluster Click Rates?</h1>
                                <p>This action is irreversible.</p>
                                <button onClick={handleWipeSubClusterCounts}>Clear Click Rates</button>
                                <button onClick={closeSubCluster}>Cancel</button>
                            </div>
                        </div>
                    )}
                </div>
                <div class="admin-landing-column">
                
                <a href="/school-management-page">School Management Page</a>
                <a onClick={handleButtonClickLogout}>Logout</a>
                </div>

                </div>
            </div>
            <BottomRectangle/>
        </div>
    )

}


export default AdminLandingPage;