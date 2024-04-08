// LAST EDITED 04/05/2024 Gavin T. Anderson

// Import necessary modules and components
import BottomRectangle from "../page_Components/BottomRectangle"; // Importing the bottom rectangle component
import "./AdminLandingPage.css"; // Importing the CSS file for styling
import { ExcelGenerationQueue } from "./ExcelGeneration"; // Importing Excel generation function
import { getAuth, getIdToken, signOut } from "firebase/auth"; // Importing Firebase authentication functions
import { useNavigate } from 'react-router-dom'; // Importing useNavigate hook for navigation
import { useState } from "react"; // Importing useState hook for managing component state
import app from "../login_components/FirebaseConfig"; // Importing Firebase configuration

// Define the AdminLandingPage component
const AdminLandingPage = () => {
// Initialize hooks and state variables
const navigate = useNavigate(); // useNavigate hook for navigation
const [openClusterWipe, setClusterWipe] = useState(false); // State variable for opening/closing cluster wipe popup
const [openSubClusterWipe, setSubClusterWipe] = useState(false); // State variable for opening/closing subcluster wipe popup
const [openDemographicWipe, setDemographicWipe] = useState(false); // State variable for opening/closing demographic wipe popup
const [message, setMessage] = useState(''); // State variable for storing popup message
const [confirmPopup, setConfirmPopup] = useState(false); // State variable for showing/hiding confirmation popup

// Firebase authentication instance
const auth = getAuth(app);

// Function to close confirmation popup
const closePopup = () => {
    setConfirmPopup(false);
}

// Functions to open/close cluster wipe popup
const openCluster = () => {
    setClusterWipe(true);
}
const closeCluster = () => {
    setClusterWipe(false);
}

// Functions to open/close subcluster wipe popup
const openSubCluster = () => {
    setSubClusterWipe(true);
}
const closeSubCluster = () => {
    setSubClusterWipe(false);
}

// Functions to open/close demographic wipe popup
const openDemographic = () => {
    setDemographicWipe(true);
}
const closeDemographic = () => {
    setDemographicWipe(false);
}

// Function to handle user logout
const handleButtonClickLogout = async () => {
    // Logout
    const auth = getAuth();
    try {
        await signOut(auth);
        console.log("Logout.");
        navigate('/login');
    } catch(error) {
        console.error('Logout error:', error.message);
    }
};

// Function to handle wiping cluster click counts
const handleWipeClusterCounts = async () => {
    try {
        const user = auth.currentUser;
        if (user) {
            // Download excel file before the info is wiped
            ExcelGenerationQueue();
            const token = await user.getIdToken();
            const response = await(fetch('http://localhost:3001/wipe-cluster-clickCounts',  {
                method: 'POST', 
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            }))
            if (response.ok) {
                closeCluster();
                setMessage('Successfully cleared Cluster Click Counts.');
                setConfirmPopup(true);
            } else {
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

// Function to handle wiping subcluster click counts
const handleWipeSubClusterCounts = async () => {
    try {
        const user = auth.currentUser;
        if (user) {
            // Download excel file before the info is wiped
            ExcelGenerationQueue();
            const token = await user.getIdToken();
            const response = await(fetch('http://localhost:3001/wipe-subcluster-clickCounts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }))
            if(response.ok) {
                closeSubCluster();
                setMessage('Successfully cleared SubCluster Click Counts.');
                setConfirmPopup(true);
            } else {
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

// Function to handle wiping demographic information
const handleWipeDemographicInfo = async () => {
    try {
        const user = auth.currentUser;
        if (user) {
            // Download excel file before info is wiped
            ExcelGenerationQueue();
            const token = await user.getIdToken();
            const response = await(fetch('http://localhost:3001/wipe-demographic-counts', {
                method: 'POST', 
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }))
            if (response.ok) {
                closeDemographic();
                setMessage('Successfully cleared Demographic Information.');
                setConfirmPopup(true);
            } else {
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

// Render the AdminLandingPage component
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
                    {/* Links to various admin functionalities */}
                    <a href="/login/adminpage/createstaffpage">Create Staff Account</a>
                    <a href="/login/staffclusters">Staff Cluster View</a>
                    <a href="/subclustermanagementpage">SubCluster Management</a>
                    <a onClick={openCluster}>Clear Cluster Click Counts</a>
                    <a onClick={openDemographic}>Clear Demographic Information Data</a>
                    {/* Popup for confirming cluster wipe */}
                    {openClusterWipe && (
                        <div className="popup">
                            <div className="popup-content">
                                <h1>Are you sure you want to clear Cluster Click Rates?</h1>
                                <p>This action will automatically generate an Excel report and is irreversible.</p>
                                <button onClick={handleWipeClusterCounts}>Clear Click Rates</button>
                                <button onClick={closeCluster}>Cancel</button>
                            </div>
                        </div>
                    )}
                    {/* Popup for confirming demographic wipe */}
                    {openDemographicWipe && (
                        <div className="popup">
                            <div className="popup-content">
                                <h1>Are you sure you want to clear stored Demographic Information?</h1>
                                <p>This action will automatically generate an Excel report and is irreversible.</p>
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
                    <a onClick={openSubCluster}>Clear SubCluster Click Counts</a>
                    <a  onClick={ExcelGenerationQueue}>Export Data (.xlsx)</a>
                    {/* Popup for confirming subcluster wipe */}
                    {openSubClusterWipe && (
                        <div className="popup">
                            <div className="popup-content">
                                <h1>Are you sure you want to clear SubCluster Click Rates?</h1>
                                <p>This action will automatically generate an Excel report and is irreversible.</p>
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
        <BottomRectangle/> {/* Render the bottom rectangle component */}
    </div>
)
}

// Export the AdminLandingPage component
export default AdminLandingPage;