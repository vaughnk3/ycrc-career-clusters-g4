import './ManagementSubCluster.css'
import EditNameSubcluster from './EditNameSubcluster';
import EditDescriptionSubcluster from './EditDescriptionSubcluster';
import EditSalarySubCluster from './EditSalarySubCluster';
import EditGrowthSubCluster from './EditGrowthSubCluster';
import EditEducationSubCluster from './EditEducationSubCluster';
import DeleteSubClusterButton from './DeleteSubClusterButton';
import EditImageSubCluster from './EditImageSubCluster';


/*
This file contains the Javascript code and GET requests utilized by staff accounts to conditionally render 
each cluster, along with their managerial buttons to edit name, description, salary, growth rate, education
level, replace image, or delete subcluster
Components:
EditNameSubcluster
EditImageSubcluster
EditDescriptionSubcluster
EditSalarySubcluster
EditGrowthSubcluster
EditEducationSubcluster
DeleteSubclusterButton

KJ Vaughn
*/

//React component which recieves subcluster ID and name used for mapping each subcluster in staff management page
const ManagementSubCluster = ({ID, subclusterName}) => {

    //Return the HTML and elements for sructure used for mapping each particular subcluster, containing
    //the button to edit name, description, salary, growth rate, education level, replace image, or deletion for that particular cluster 
    return (
        <div className="subcluster_m">
            <h2>{subclusterName}</h2>
            <div className="sc_editbar">
            <EditNameSubcluster ID={ID} />
            <EditImageSubCluster ID={ID} />
            <EditDescriptionSubcluster ID={ID} />
            <EditSalarySubCluster ID={ID} />
            <EditGrowthSubCluster ID={ID} />
            <EditEducationSubCluster ID={ID} />
            <DeleteSubClusterButton ID={ID} />
            </div>
        </div>
    )
}

export default ManagementSubCluster;