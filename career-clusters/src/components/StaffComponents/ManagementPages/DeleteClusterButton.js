import './ManagementCluster.css';
import React, { useState } from "react";
import { getAuth } from "firebase/auth";
import app from "../../login_components/FirebaseConfig";



const DeleteClusterButton = ({ID}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [deleteStatus, setDeleteStatus] = useState(false);
    const [message, setMessage] = useState('');


    const auth = getAuth(app);
    
    const openPopup = () => {
        setIsOpen(true);
    }

    const closePopup = () => {
        setIsOpen(false);
    }

    const closeStatus = () => {
        setDeleteStatus(false);
        refreshPage();
    }
   

    
    const refreshPage = () => {
        window.location.reload();
    }

    
    const deleteCluster = async () => {
        try {

            const user = auth.currentUser;
            if(user) {
                const token = await user.getIdToken();
                const response = await(fetch('http://localhost:3001/login/staffclusters/clustermanagementpage/delete-cluster', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ ID })
                }));
                if (response.ok) {
                    console.log('Cluster deleted successfully');
                    setIsOpen(false);
                    setMessage('Successfully deleted cluster.')
                    setDeleteStatus(true);
                   
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