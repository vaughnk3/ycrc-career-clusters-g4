import BottomRectangle from "../../page_Components/BottomRectangle";
import './ClusterManagementPage.css';
import ManagementCluster from "./ManagementCluster";
import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import './ManagementCluster.css';
import { getAuth } from "firebase/auth";
import app from "../../login_components/FirebaseConfig";


const ClusterManagementPage = () => {
    //Set all useState variables to be used in the file. 
    const navigate = useNavigate();
    const [clusters, setClusters] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [clusterName, setClusterName] = useState('');
    const [newImage, setNewImage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [addStatus, setAddStatus] = useState(false);
    const [message, setMessage] = useState('');

    const auth = getAuth(app);

    const closeError = () => {
        setError(false);
        refreshPage();
    }

    const closeStatus = () => {
        setAddStatus(false);
        refreshPage();
    }

    //Open the popup
    const openPopup = () => {
        setIsOpen(true);
    }

    //Close the popup
    const closePopup = () => {
        setIsOpen(false);
    }

    //Refresh the page function when an add is done
    const refreshPage = () => {
        window.location.reload();
      }


    // Post request for adding a cluster
    const addCluster = async () => {
        var canSend = true;
        //Checks if any image has been entered and sets false flag & border outlining if so 
        if(!newImage) {                                         
            document.getElementById("imgWrapper").style.border = '2px solid red';
            canSend = false;
        }  
        if(canSend === true) {      // If no flag, allow for requests to be made 
        try {
                const user = auth.currentUser;
                if(user) {
                    const token = await user.getIdToken();
                    const formData = new FormData();
                    formData.append('image', newImage); // Append the file
                    formData.append('clusterName', clusterName); // Append the clusterName as a text field
            
                    const response = await fetch('http://localhost:3001/login/staffclusters/clustermanagementpage/add-cluster', {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${token}`
                        },
                        body: formData,
                    
                    });
            
                    if (response.ok) {
                        console.log('Cluster and image added successfully');
                        setIsOpen(false);
                        setMessage('Successfully created new cluster.')
                        setAddStatus(true);
        
                    } else {
                        console.error('Failed to add cluster and upload image');
                        setIsOpen(false);
                        setMessage('Failed to create new cluster.')
                        setAddStatus(true);
                    }
                }
            
        } catch (error) {
            console.error('Error adding cluster and uploading image: ', error);
            setIsOpen(false);
            setMessage('Failed to create new cluster').
            setAddStatus(true);
        }
    }
        // setIsOpen(false);
        //refreshPage();
    };
    

    //Grab all the cluster information to display on the page
    useEffect(() => {
        const fetchClusters = async () => {
            try {
                const response = await (fetch('http://localhost:3001/login/staffclusters/clustermanagementpage'));
                if (!response.ok) {
                    setLoading(false);
                    setError(true);
                    throw new Error('Error fetching clusters');
                }
                const data = await response.json();
                setClusters(data);
                setLoading(false);
            } catch (error) {
                console.error('Error: ', error);
                setLoading(false);
                setError(true);
            }
        }
        fetchClusters();
    }, []);

    //If the page takes a while to load, display loading image.
    if (loading) {
        return <div id="loading-animation"></div>
    }

    //Navigation for a user clicking the back button
    const backButtonHandler = () => 
    {
        navigate('/login/staffclusters');
    }

    //Set the image when the user selects an image file to input
    const handleFileInputChange = (e) => 
    {
        setNewImage(e.target.files[0]);
    }

    return (
        <div id="page">
            <div id="_topRectangle">
                <button id="back_button" onClick={backButtonHandler}>Back</button>
                <button onClick={openPopup} id="add_cluster">Add Cluster +</button>
                {isOpen && (
                    <div className="popup">
                        <div className="popup-content">                           
                            <div className="left-add">
                            <label for="clusterNamePop">Name</label>
                            <input type="text" id="clusterNamePop" name="clusterName" placeholder="Enter the name of new cluster" value={clusterName} onChange={(e) => setClusterName(e.target.value)}></input>
                            </div>
                            <br/>
                            <br/>
                            <div className="right-add">
                            <div id="imgWrapper">
                            <label for="imgN">Image</label>
                                <input type="file" id="imgN" name="imgN" accept="image/*" onChange={handleFileInputChange}></input>
                            </div>
                            </div>
                            <div className="button-row">
                                <button className="addcancelButton" onClick={closePopup}>Cancel</button>
                                <button className="addaddButton" onClick={addCluster}>Add</button>
                            </div>
                        </div>
                    </div>
                )}
                <h2>Cluster Management Page</h2>
                <h4>Please select an option for cluster management.</h4>
            </div>

            {error && (
                <div className="popup">
                    <div className="popup-content">
                        <h1>Error fetching clusters.</h1>
                        <button onClick={closeError}>Acknowledge and Refresh</button>
                    </div>
                </div>
            )}

            { addStatus && (
                <div className="popup">
                    <div className="popup-content">
                        <h1>{message}</h1>
                        <button onClick={closeStatus}>Acknowledge and Refresh</button>
                    </div>
                </div>
            )}
            
            <div class="content content-margin">
                <ul class="mgmt_list">
                    {clusters.map((cluster) => (
                        <li>
                            <ManagementCluster key={cluster.id} ID={cluster.id} clusterName={cluster.clusterName} />
                        </li>
                    ))}
                </ul>
            </div>



            <BottomRectangle />
        </div>



    )
}

export default ClusterManagementPage;

