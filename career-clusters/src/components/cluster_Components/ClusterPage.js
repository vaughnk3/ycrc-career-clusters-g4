import React, { useState, useEffect } from "react";
import Cluster from './Cluster.js'
import BottomRectangle from "../page_Components/BottomRectangle.js"
import UserIcon from "../page_Components/UserIcon.js";
import { useNavigate } from 'react-router-dom';
import './ClusterPage.css';

/*
This page contains the javascript for the ClusterPage, which is the general user view page.
Here we will fetch all of the clusters, handle a click count update, have
error message pop-up incase the clusters are not able to render, and navigation to the 
subclusters pertaining to the clicked cluster. 

LAST EDITED -- 04 / 05 / 2024 --- Gavin T. Anderson
*/

const ClusterPage = () => {
    //Set all our hooks to be used later. 
    //Navigate is used to forcefully navigate a user to a certain page.
    const navigate = useNavigate();

    // Store received clusters after fetching from database.
    const [clusters, setClusters] = useState([]);

    // If the page is loading, we use this to decide when to run the loading animation.
    const [loading, setLoading] = useState(true);

    // If we have an error rendering clusters, set openError true to engage the popup.
    const [openError, setOpenError] = useState(false);

    // Attempt to fetch all clusters to display
    useEffect(() => {
        const fetchClusters = async () => {
            try {
                // Fetch clusters
                const response = await (fetch('http://localhost:3001/cluster'));

                // If response is not ok, throw an error
                if(!response.ok) {
                    throw new Error('Error fetching clusters');
                }

                // Get the json from our response 
                const data = await response.json();

                // Set the clusters in 'clusters'
                setClusters(data);

                // Stop loading
                setLoading(false);
            
                // If there is some sort of failure, catch it, and display error screen.
            } catch (error) {
                console.error('Error: ', error);
                setLoading(false);
                setOpenError(true);
                //setLoading(false);
            }
        }
        fetchClusters();
    }, []);

    // If in loading state, render loading animation.
    if (loading) {
        return <div id="loading-animation"></div>
     }

     // When the user selects acknowledge on the error popup, close the popup. 
    const closeError = () => {
        setOpenError(false);
        window.location.reload();
    }

    // When a cluster is clicked, update its corresponding click count. 
    const handleClusterClick = (ID) => {
        // Define method for updatinng cluster click count
        const updateClusterClickCount = async () => {
            try {
                // Attempt fetch
                const response = await (fetch('http://localhost:3001/update-clust-clickCnt', {
                    method: 'POST', 
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify( { clusterID: ID })
                }));
                // If response is okay, console success
                if (response.ok) {
                    console.log('Cluster click count updated successfully');
                } else { // If response is bad, let user know that it failed to update the cluster click count
                    console.error('Failed to update cluster clickcount')
                }
                // If the try attempt fails, console that a failure happened with the specific error
            } catch (error) {
                console.error('Error updating cluster clickcount: ', error)
            }
        }

        // Call the update cluster click count method
        updateClusterClickCount();

        // Navigate to subcluster page
        navigate(`/cluster/subcluster/${ID}`);
    }

    
    // Handle the cluster form submission, and navigate to next page. 
    const handleFormSubmit =(e) => {
        e.preventDefault();
        navigate('/cluster/subcluster')
    }

    // HTML Return for page
    return (
    <div id="page">
        <div id="topRectangle">
            <h1>Welcome</h1>
            <p>Please select a cluster that interests you. This website will help show you potential careers in your area of interest.</p>
        </div>
        

        {openError && (
                <div className="popup">
                    <div className="popup-content">
                        <h1>Error</h1>
                        <p>Error rendering clusters. Please try again later.</p>
                        <button onClick={closeError}>Acknowledge and Refresh</button>
                    </div>
                </div>
         )}
        
        <UserIcon/>
        <div class="content content-margin">
            <li id="c_array">
                {clusters.map(cluster => (
                <form id="form1" onSubmit={handleFormSubmit}>
                    <Cluster key={cluster.id} id={cluster.id} clusterName={cluster.clusterName} onClick={handleClusterClick}/>
                </form>
                ))}
            </li>
        </div>

     

  
        <BottomRectangle/>

    </div>
    )
}


export default ClusterPage;


