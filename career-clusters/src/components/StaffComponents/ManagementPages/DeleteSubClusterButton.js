import './ManagementSubCluster.css'
import './ManagementCluster.css'
import React, { useState } from "react";
import { getAuth } from "firebase/auth";
import app from "../../login_components/FirebaseConfig";


/*
This file contains the Javascript code and POST requests utilized by staff accounts to delete any given
subcluster from SQL database. Sends specified subcluster ID to server which removes given ID from Subcluster table

KJ Vaughn
*/


//React component which recieves cluster ID property to remove any of it's corresponding subclusters
const DeleteSubClusterButton = ({ID}) => {
    //State variables to keep track of error handling and deletion status 
    const [isOpen, setIsOpen] = useState(false);
    const [statusDelete, setStatusDelete] = useState(false);
    const [message, setMessage] = useState('');


    const auth = getAuth(app);

    //Update status of deletion confirmation popup to open
    const openPopup = () => {
        setIsOpen(true);
    }

    //Update status of deletion confirmation popup to closed    
    const closePopup = () => {
        setIsOpen(false);
    }

    //Update state to close status popup and refresh page
    const closeStatus = () => {
        setStatusDelete(false);
        refreshPage();
    }
   
    //Function to refresh page 
    const refreshPage = () => {
        window.location.reload();
    }

    //POST request sent to server which contains ID of specified subcluster
    const DeleteSubCluster = async () => {
        try {
            const user = auth.currentUser;
            //Checks if user is a staff account
            if(user) {
                const token = await user.getIdToken();
                //POST request sent to server containing sublcluster ID to be removed from Subcluster table 
                const response = await(fetch('http://localhost:3001/subclustermanagementpage/delete-subcluster', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,

                    },
                    body: JSON.stringify({ ID })
                }));
                
                //If POST request goes through, alert user of success and display within a popup 
                if (response.ok) {
                    console.log('SubCluster deleted successfully');
                    setIsOpen(false);
                    setMessage('Successfully deleted SubCluster.');
                    setStatusDelete(true);
                //Otherwise, alert user of failure and display error message within popup
                } else {
                    console.error('Failed to delete subcluster');
                    setIsOpen(false);
                    setMessage('Failed to delete SubCluster.');
                    setStatusDelete(true);
                    
                } 
            }
        }   catch (error) {
            console.error('Error deleting subcluster: ', error);
            setIsOpen(false);
            setMessage('Failed to delete SubCluster.');
            setStatusDelete(true);
            
        }
        //console.log('POST request sent from delete subcluster')
        //setIsOpen(false);
        //refreshPage();
    }

    //Return the HTML and elements used to populate Delete button, which has functionality to confirm and delete a particular subcluster from SQL database
    return (
        <div className="cluster-button">
            <button className="delete-button" onClick={openPopup} >Delete</button>
            {isOpen && (
                    <div className="popup">
                        <div className="delete-popup-content">  
                            <label for='deletebuttonrow'>Are you sure you want to delete this subcluster?</label>
                            <div className='deletebuttonrow'>
                            <button onClick={closePopup} className="cancelButton">Cancel</button>
                            <button id="deleteCluster" onClick={DeleteSubCluster}>Delete</button>
                            </div>
                        </div>
                    </div>
                )}

            {statusDelete && (
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


export default DeleteSubClusterButton;