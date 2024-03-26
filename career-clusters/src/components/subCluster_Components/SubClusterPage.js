import BottomRectangle from "../page_Components/BottomRectangle.js";
import UserIcon from "../page_Components/UserIcon.js";
import SubCluster from "./SubCluster.js";
import './SubClusterPage.css'
import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
// import { getAuth, onAuthStateChanged } from "firebase/auth";        //new
// import app from "../login_components/FirebaseConfig.js"         //new



const SubClusterPage = ({ }) => {
    const navigate = useNavigate();

    // const auth = getAuth(app);      //initialize firebase auth

  

    const handleSubClusterClick = (ID) => {
        console.log(ID)

        // Update the click count for subclusters
        const updateSubClusterClickCount = async () => {
            try {
                console.log("SUB   IDDDDDD, ", ID)
                const response = await (fetch('http://localhost:3001/updates-subclust-clickCnt', {
                    method: 'POST', 
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify( { subclusterID: ID })
                }));
                if (response.ok) {
                    console.log('SubCluster click count updated successfully');
                } else {
                    console.error('Failed to update subcluster clickount')
                }
            } catch (error) {
                console.error('Error updating subcluster clickcount: ', error)
            }
        }

        // Call the update click count function
        updateSubClusterClickCount();

    }

    const { clusterId } = useParams();
    const [subclusters, setSubclusters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openError, setOpenError] = useState(false);

    useEffect(() => {
        const fetchSubclusters = async () => {
            try {
                const response = await fetch(`http://localhost:3001/cluster/subcluster/${clusterId}`);
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

    if (loading) {
        return <div id="loading-animation"></div>
    }

    const closeError = () => {
        setOpenError(false);
        window.location.reload();
    }

    //const subclusterF = subclusters.length > 0 ? subclusters[0] : {};

    return (
        <div id="page">
            <div id="_topRectangle">
                <p>Please select a field within the career field selected.</p>
            </div>


            {openError && (
                <div className="popup">
                    <div className="popup-content">
                        <h1>Error</h1>
                        <p>Error rendering SubClusters. Please try again later.</p>
                        <button onClick={closeError}>Acknowledge and Refresh</button>
                    </div>
                </div>
            )} 

            <UserIcon />
            <div class="content content-margin">
                <ul id="subcluster-list">
                    {subclusters.map((subcluster) => (
                        <li>
                            <SubCluster key={subcluster.id} ID={subcluster.id} subID={subcluster.clusterID} subclusterName={subcluster.subclusterName} onClick={handleSubClusterClick}/>
                        </li>
                    ))}
                </ul>
            </div>

            <BottomRectangle />
        </div>
    )
}


export default SubClusterPage;