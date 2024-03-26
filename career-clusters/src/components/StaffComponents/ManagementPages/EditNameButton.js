import './ManagementCluster.css';
import React, { useState } from "react";
import { getAuth } from "firebase/auth";
import app from "../../login_components/FirebaseConfig";


const EditNameButton = ({ID}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [clusterName, setClusterName] = useState('');
    const [editStatus, setEditStatus] = useState(false);
    const [message, setMessage] = useState('');
   

    const auth = getAuth(app);

    // Once the post request occurs, refresh the page so we can see the changes. 
    const refreshPage = () => {
        window.location.reload();
    }

    const closeStatus = () => {
        setEditStatus(false);
        refreshPage();
    }


    const openPopup = () => {
        setIsOpen(true);
    }

    const closePopup = () => {
        setIsOpen(false);
    }

   

    

    const changeClusterName = async () => {
        try {
            const user = auth.currentUser;
            if(user) {
                const token = await user.getIdToken();
                const response = await(fetch('http://localhost:3001/login/staffclusters/clustermanagementpage/edit-cluster-name', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ clusterName, ID })
            }));
            if (response.ok) {
                console.log('Cluster updated successfully');
                setIsOpen(false);
                setMessage(`Successfully changed cluster name to: ${clusterName}`);
                setEditStatus(true);
            } else {
                console.error('Failed to update cluster');
                setIsOpen(false);
                setMessage('Failed to update cluster name.')
                setEditStatus(true);
              
            } 
        }
        }   catch (error) {
            console.error('Error updating cluster: ', error);
            setIsOpen(false);
            setMessage('Failed to update cluster name.')
            setEditStatus(true);
        }
        //console.log('POST request sent from update button')
        //setIsOpen(false);
        //refreshPage();
    }


    

    return (
        <div id="cluster-button">
                <button className="management-button" onClick={openPopup}>Edit Name</button>
                {isOpen && (
                    <div className="popup">
                        <div className="popup-content">  
                        <label for="clusterName" className="standard-popup"><b>Edit Cluster Name</b></label>
                            <br/><br/>
                            <input type="text" id="clusterName" name="clusterName" placeholder="Enter the changed cluster name." value={clusterName} onChange={(e) => setClusterName(e.target.value)}></input>
                            <br/>
                            <div class="editbuttonrow">
                            <button onClick={closePopup} className="standard-cancelButton">Cancel</button>
                            <button id="standard-submitName" onClick={changeClusterName}>Submit</button>
                            </div>
                        </div>
                    </div>
                )}

                { editStatus && (
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



export default EditNameButton;