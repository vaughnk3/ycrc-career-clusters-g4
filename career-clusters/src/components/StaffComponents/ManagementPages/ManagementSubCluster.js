import './ManagementSubCluster.css'
import EditNameSubcluster from './EditNameSubcluster';
import EditDescriptionSubcluster from './EditDescriptionSubcluster';
import EditSalarySubCluster from './EditSalarySubCluster';
import EditGrowthSubCluster from './EditGrowthSubCluster';
import EditEducationSubCluster from './EditEducationSubCluster';
import DeleteSubClusterButton from './DeleteSubClusterButton';
import EditImageSubCluster from './EditImageSubCluster';



const ManagementSubCluster = ({ID, subclusterName}) => {

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