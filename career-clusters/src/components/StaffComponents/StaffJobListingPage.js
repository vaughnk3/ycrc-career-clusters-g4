import {useNavigate} from "react-router-dom"
import { getAuth, signOut } from "firebase/auth";
import { ExcelGenerationQueue } from "../StaffComponents/ExcelGeneration";
import BottomRectangle from "../page_Components/BottomRectangle";


const StaffJobListingPage = () => {
  const navigate = useNavigate();

    const handleButtonClickStaff = () => {
        //Need to check whether or not user has correct permissions. 
        navigate('/login/adminpage');
      };


      const handleSubclusterManagementClick = () => {
        navigate('/subclustermanagementpage')
      }
    
    
      const handleButtonClickClusterManagement = () => {
        navigate('/login/staffclusters/clustermanagementpage');
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
      <BottomRectangle/>
  </div>
    )
}

export default StaffJobListingPage;