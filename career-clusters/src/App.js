// Imports
import './App.css';
import DemographicInfo from './components/homePage/DemographicInfo';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './components/login_components/LoginPage.js';
import ClusterPage from './components/cluster_Components/ClusterPage';
import SubFieldsPage from './components/SubFieldInfo/SubFieldPage';
import SubClusterPage from './components/subCluster_Components/SubClusterPage.js';
import StaffClusters from './components/StaffComponents/StaffClusters';
import StaffSubClusters from './components/StaffComponents/StaffSubClusters';
import StaffSubFields from './components/StaffComponents/StaffSubFields';
import JobListingPage from './components/JobListingComponents/JobListingPage';
import StaffJobListingPage from './components/StaffComponents/StaffJobListingPage';
import AdminLandingPage from './components/StaffComponents/AdminLandingPage';
import ModifyPermsPage from './components/StaffComponents/AdminPrivComponents/ModifyPermsPage';
import CreateStaffAccount from './components/StaffComponents/AdminPrivComponents/CreateStaffAccount';
import ClusterManagementPage from './components/StaffComponents/ManagementPages/ClusterManagementPage';
import SubClusterManagementPage from './components/StaffComponents/ManagementPages/SubClusterManagementPage';
import ProtectedRoute from './components/StaffComponents/ProtectedRoute.js';
import SchoolManagementPage from './components/StaffComponents/ManagementPages/SchoolManagementPage';
import AdminProtectedRoute from './components/StaffComponents/AdminProtectedRoute.js';

// Base App Function Declaration and Route Creation
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DemographicInfo />} />
        <Route path="/cluster" element={<ClusterPage />} />
        <Route path="/cluster/subcluster/:clusterId" element={<SubClusterPage/>} />
        <Route path="/cluster/subcluster/subclusterinfo/:subclusterId" element={<SubFieldsPage/>} />
        <Route path="/cluster/subcluster/subclusterinfo/joblistings" element={<JobListingPage/>} />

        <Route path="/login" element={<LoginPage />} />

        <Route path="/login/staffclusters" element={<ProtectedRoute><StaffClusters/></ProtectedRoute>} />
        <Route path="/login/staffclusters/staffsubclusters/:clusterId" element={<ProtectedRoute><StaffSubClusters/></ProtectedRoute>} />
        <Route path="/login/staffclusters/staffsubclusters/staffsubclusterinfo/:subclusterId" element={<ProtectedRoute><StaffSubFields/></ProtectedRoute>} />
        <Route path="/login/staffclusters/staffsubclusters/staffsubclusterinfo/staffjoblistings" element={<ProtectedRoute><StaffJobListingPage/></ProtectedRoute>} />

        <Route path="/login/adminpage" element={<AdminProtectedRoute><AdminLandingPage/></AdminProtectedRoute>} />
        <Route path="/login/adminpage/modifyperms" element={<AdminProtectedRoute><ModifyPermsPage/></AdminProtectedRoute>} />
        <Route path="/login/adminpage/createstaffpage" element={<AdminProtectedRoute><CreateStaffAccount/></AdminProtectedRoute>} />

        <Route path="/login/staffclusters/clustermanagementpage" element={<ProtectedRoute><ClusterManagementPage/></ProtectedRoute>} />
        <Route path="/subclustermanagementpage" element={<ProtectedRoute><SubClusterManagementPage/></ProtectedRoute>} />
        <Route path="/school-management-page" element={<ProtectedRoute><SchoolManagementPage/></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;

