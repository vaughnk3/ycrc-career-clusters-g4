import './ManagementCluster.css';
import React, { useState } from "react";
import { getAuth } from "firebase/auth";
import app from "../../login_components/FirebaseConfig";


/*
This file contains the Javascript code and POST requests utilized by staff accounts to delete any given
cluster from SQL database. Sends specified cluster ID to server which removes given ID from Cluster table

KJ Vaughn
*/

//React component used by staff to delete a given cluster from SQL database
const DeleteClusterButton = ({ID}) => {

    //State variables to keep track of error messages, status, and popup status
    const [isOpen, setIsOpen] = useState(false);
    const [deleteStatus, setDeleteStatus] = useState(false);
    const [message, setMessage] = useState('');


    const auth = getAuth(app);
    
    //Open popup to confirm deletion of cluster
    const openPopup = () => {
        setIsOpen(true);
    }

    //Close popup containing confirmation of deletion of cluster 
    const closePopup = () => {
        setIsOpen(false);
    }

    //Update state of deletion status and refresh page 
    const closeStatus = () => {
        setDeleteStatus(false);
        refreshPage();
    }
   

    //Function to refresh page 
    const refreshPage = () => {
        window.location.reload();
    }

    //POST request which specifies given cluster selected and sends this information to the server, which performs SQL query
    //to remove that cluster from database
    const deleteCluster = async () => {
        try {

            const user = auth.currentUser;
            //Check if user is a staff account
            if(user) {
                const token = await user.getIdToken();
                //POST request sent to server containing specified cluster
                const response = await(fetch('http://localhost:3001/login/staffclusters/clustermanagementpage/delete-cluster', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ ID })
                }));
                //If POST request goes through, alert user and display status within a popup
                if (response.ok) {
                    console.log('Cluster deleted successfully');
                    setIsOpen(false);
                    setMessage('Successfully deleted cluster.')
                    setDeleteStatus(true);
                //Otherwise, alert user of failure and display error message within popup
                } else {
                    console.error('Failed to delete cluster');
                    setIsOpen(false);
                    setMessage('Failed to delete cluster.');
                    setDeleteStatus(true);
                   
                } 
            }
        }   catch (error) {
            console.error('Error deleting cluster: ', error);
            setIsOpen(false);
            setMessage('Failed to delete cluster.');
            setDeleteStatus(true);
            
        }
        //console.log('POST request sent from delete button')
        //setIsOpen(false);
        //refreshPage();
    }

    //Return the HTML and elements used to populate Delete button, which has functionality to confirm and delete a particular cluster from SQL database
    return (
        <div id="cluster-button">
                <button class="management-button" onClick={openPopup}>Delete</button>
                {isOpen && (
                    <div className="popup">
                        <div className="delete-popup-content">  
                            <label htmlFor='deletebuttonrow'>Are you sure you want to delete this cluster?</label>
                            <div class="deletebuttonrow">
                            <button onClick={closePopup} className="cancelButton">Cancel</button>
                            <button id="deleteCluster" onClick={deleteCluster}>Delete</button>
                            </div>
                        </div>
                    </div>
                )}

                {deleteStatus && (
                    <div className="popup">
                        <div className="popup-content">
                            <h1>{message}</h1>
                            <button onClick={closeStatus}>Acknowledge and Refresh</button>
                        </div>
                    </div>
                )}
               
            </div>
    )
}



export default DeleteClusterButton;