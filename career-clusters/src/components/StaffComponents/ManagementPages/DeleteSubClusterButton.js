import './ManagementSubCluster.css'
import './ManagementCluster.css'
import React, { useState } from "react";
import { getAuth } from "firebase/auth";
import app from "../../login_components/FirebaseConfig";


const DeleteSubClusterButton = ({ID}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [statusDelete, setStatusDelete] = useState(false);
    const [message, setMessage] = useState('');


    const auth = getAuth(app);


    const openPopup = () => {
        setIsOpen(true);
    }

    const closePopup = () => {
        setIsOpen(false);
    }

    const closeStatus = () => {
        setStatusDelete(false);
        refreshPage();
    }
   

    const refreshPage = () => {
        window.location.reload();
    }

    const DeleteSubCluster = async () => {
        try {
            const user = auth.currentUser;
            if(user) {
                const token = await user.getIdToken();
                const response = await(fetch('http://localhost:3001/subclustermanagementpage/delete-subcluster', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,

                    },
                    body: JSON.stringify({ ID })
                }));
                if (response.ok) {
                    console.log('SubCluster deleted successfully');
                    setIsOpen(false);
                    setMessage('Successfully deleted SubCluster.');
                    setStatusDelete(true);
                    
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

    return (
        <div className="cluster-button">
            <button className="deleteButton" onClick={openPopup} >Delete</button>
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