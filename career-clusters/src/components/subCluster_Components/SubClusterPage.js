import BottomRectangle from "../page_Components/BottomRectangle.js";
import UserIcon from "../page_Components/UserIcon.js";
import SubCluster from "./SubCluster.js";
import './SubClusterPage.css'
import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';


/* 
This component contains the SubCluster display page for general view. 
It contains the fetching and mapping of the subclusters specified upon the click of a cluster. 
*/

const SubClusterPage = ({ }) => {
    // Define navigate hook
    const navigate = useNavigate();

    // Get the slug from the page route
    const { clusterId } = useParams();
    // Store the fetched subclusters
    const [subclusters, setSubclusters] = useState([]);
    // Keeps track of the loading state
    const [loading, setLoading] = useState(true);
    // Keeps track of the error popup state
    const [openError, setOpenError] = useState(false);

   // Testing function to ensure correct Subcluster routing
    const handleSubClusterClick = (ID) => {
        console.log("IN SUBCLUSRER CLICK:  ", ID)
    }

    // Close the error popup and refresh the page
    const closeError = () => {
        setOpenError(false);
        window.location.reload();
    }

    // Fetch the subclusters from selected cluster ID
    useEffect(() => {
        const fetchSubclusters = async () => {
            try {
                // Attempt fetch
                const response = await fetch(`http://localhost:3001/cluster/subcluster/${clusterId}`);

                // Failure
                if (!response.ok) {
                    throw new Error('Error fetching subclusters');
                }

                // Success - receive data and set data
                const data = await response.json();
                setSubclusters(data);
                setLoading(false);

                // Failure - bring up error popup
            } catch (error) {
                console.error('Error: ', error);
                setLoading(false);
                setOpenError(true);
            }
        }

        fetchSubclusters();
    }, [clusterId])


    // Loading animation
    if (loading) {
        return <div id="loading-animation"></div>
    }

    // Return the HTML for this component
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

// Export completed component
export default SubClusterPage;