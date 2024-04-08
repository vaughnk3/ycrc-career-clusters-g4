/*
    This component represents the Staff Clusters page.

    Features:
    - Fetches clusters data from the server.
    - Displays clusters as clickable elements.
    - Handles user permissions for various actions.
    - Provides options for cluster management, logout, admin landing page, school management, subcluster management, and data export.
    - Displays loading animation while fetching data.
    - Displays error popup in case of fetch failure or insufficient permissions.

    LAST EDITED 04/05/2024 Gavin T. Anderson
*/

// Imports
import './StaffClusters.css';
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './OverlayRectangle.css';
import { useState, useEffect } from 'react';
import Cluster_S from './Cluster_S';
import BottomRectangle from '../page_Components/BottomRectangle';
import { getAuth, signOut } from 'firebase/auth';
import { ExcelGenerationQueue } from './ExcelGeneration';
import SchoolManagementPage from './ManagementPages/SchoolManagementPage';
import app from '../login_components/FirebaseConfig';

const StaffClusters = () => {
    const navigate = useNavigate();
    const [clusters, setClusters] = useState([]); // State for storing clusters data
    const [loading, setLoading] = useState(true); // State to track loading status
    const [isOpen, setIsOpen] = useState(false); // State to manage error popup
    const [claim, setClaim] = useState([]); // State to store user claims
    const [claimError, setClaimError] = useState(false); // State to manage insufficient permissions error

    // Function to close error popup
    const closeError = () => {
        setClaimError(false);
    };

    // Function to close general popup
    const closePopup = () => {
        setIsOpen(false);
        window.location.reload(); // Refresh the page
    };

    // Effect to fetch clusters data from the server on component mount
    useEffect(() => {
        const fetchClusters = async () => {
            try {
                const response = await fetch('http://localhost:3001/login/staffclusters');
                if (!response.ok) {
                    throw new Error('Error fetching clusters');
                }
                const data = await response.json();
                setClusters(data);
                setLoading(false);
            } catch (error) {
                setLoading(false);
                setIsOpen(true); // Show error popup
                console.error('Error: ', error);
            }
        };
        fetchClusters();
    }, []);

    // Effect to fetch user claims from the server
    useEffect(() => {
        const auth = getAuth(app);
        const fetchUserClaims = async () => {
            try {
                const response = await fetch('http://localhost:3001/get-unique-claims', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ uid: auth.currentUser.uid }), // Send user ID to server
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

    // Handling cluster click event
    const handleClusterClick = (ID) => {
        navigate(`/login/staffclusters/staffsubclusters/${ID}`);
    };

    // Handling logout event
    const handleButtonClickLogout = async () => {
        const auth = getAuth();
        try {
            await signOut(auth);
            navigate('/login');
        } catch (error) {
            console.error('Logout error:', error.message);
        }
    };

    // JSX for rendering clusters
    const renderClusters = clusters.map((cluster) => (
        <form id="form1" onSubmit={(e) => e.preventDefault()} key={cluster.id}>
            <Cluster_S id={cluster.id} clusterName={cluster.clusterName} onClick={handleClusterClick} />
        </form>
    ));

    // Handling cluster management button click event
    const handleButtonClickClusterManagement = () => {
        if (claim.claims.claims['Cluster Management']) {
            navigate('/login/staffclusters/clustermanagementpage');
        } else {
            setClaimError(true); // Show insufficient permissions error popup
        }
    };

    // Handling admin landing page button click event
    const handleButtonClickStaff = () => {
        if (claim.claims.claims['Administrator']) {
            navigate('/login/adminpage');
        } else {
            setClaimError(true); // Show insufficient permissions error popup
        }
    };

    // Handling subcluster management button click event
    const handleSubclusterManagementClick = () => {
        if (claim.claims.claims['SubCluster Management']) {
            navigate('/subclustermanagementpage');
        } else {
            setClaimError(true); // Show insufficient permissions error popup
        }
    };

    // Handling school management button click event
    const handleSchoolManagementClick = () => {
        if (claim.claims.claims['School Management']) {
            navigate('/school-management-page');
        } else {
            setClaimError(true); // Show insufficient permissions error popup
        }
    };

    // Handling export data button click event
    const handleExcelButtonClick = () => {
        if (claim.claims.claims['Export Excel']) {
            ExcelGenerationQueue();
        } else {
            setClaimError(true); // Show insufficient permissions error popup
        }
    };

    // JSX for rendering the Staff Clusters page
    return (
        <div id="page">
            {/* Error popup */}
            {isOpen && (
                <div className="popup">
                    <div className="popup-content">
                        <h1>Error</h1>
                        <p>An error occurred while fetching clusters.</p>
                        <button onClick={closePopup}>Acknowledge and Refresh</button>
                    </div>
                </div>
            )}

            {/* Insufficient permissions error popup */}
            {claimError && (
                <div className="popup">
                    <div className="popup-content">
                        <h1>You do not have access to this feature.</h1>
                        <p>Please contact an administrator if you believe this is an error.</p>
                        <button onClick={closeError}>Acknowledge</button>
                    </div>
                </div>
            )}

            {/* Clusters */}
            <div className="content content-margin">
                <ul id="c_array">{renderClusters}</ul>
            </div>

            {/* Top rectangle */}
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
                            <h2>Staff View of All Clusters</h2>
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

            {/* Bottom rectangle */}
            <BottomRectangle />
        </div>
    );
};

export default StaffClusters;

