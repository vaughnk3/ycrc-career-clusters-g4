/*
  This component represents the Staff Job Listing page.

  Features:
  - Provides options for cluster management, logout, admin landing page, subcluster management, and data export.

  LAST EDITED 04/05/2024 Gavin T. Anderson
*/

// Imports
import { useNavigate } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';
import { ExcelGenerationQueue } from '../StaffComponents/ExcelGeneration';
import BottomRectangle from '../page_Components/BottomRectangle';


const StaffJobListingPage = () => {
    const navigate = useNavigate();

    // Handling admin landing page button click event
    const handleButtonClickStaff = () => {
        navigate('/login/adminpage');
    };

    // Handling subcluster management button click event
    const handleSubclusterManagementClick = () => {
        navigate('/subclustermanagementpage');
    };

    // Handling cluster management button click event
    const handleButtonClickClusterManagement = () => {
        navigate('/login/staffclusters/clustermanagementpage');
    };

    // Handling logout button click event
    const handleButtonClickLogout = async () => {
        // Logout
        const auth = getAuth();
        try {
            await signOut(auth);
            console.log('Logout.');
            navigate('/login');
        } catch (error) {
            console.error('Logout error:', error.message);
        }
    };

    // JSX for rendering the Staff Job Listing page
    return (
        <div>
            <div className="overlay">
                <div class="staff-button-column-one">
                    <a class="staff-button" onClick={handleButtonClickClusterManagement}>Cluster Management</a>
                    <a class="staff-button" onClick={handleButtonClickLogout}>Logout</a>
                </div>
                <div class="staff-button-column-two">
                    <a class="staff-button" onClick={handleButtonClickStaff}>Admin Landing Page</a>
                    <a class="staff-button" onClick={ExcelGenerationQueue}>Export Data (.xlsx)</a>
                </div>
                <div class="staff-button-column-three">
                    <a class="staff-button" onClick={handleSubclusterManagementClick}>SubCluster Management</a>
                    <a class="staff-button">Pathways Management</a>
                </div>
            </div>
            <BottomRectangle />
        </div>
    );
};

export default StaffJobListingPage;
