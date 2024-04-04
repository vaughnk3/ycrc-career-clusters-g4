import './ManagementCluster.css';
import React, { useState } from "react";
import { getAuth } from "firebase/auth";
import app from "../../login_components/FirebaseConfig";


/*
This file contains the Javascript code and POST requests utilized by staff accounts to update the name for any given
cluster within SQL database. Sends new cluster name to be updated within Cluster table 

KJ Vaughn
*/

//React component which recieves particular selected cluster ID, used by staff to edit name for a Cluster
const EditNameButton = ({ID}) => {
    //State variable to keep track of popup status for updates and errors, along with new cluster name  
    const [isOpen, setIsOpen] = useState(false);
    const [clusterName, setClusterName] = useState('');
    const [editStatus, setEditStatus] = useState(false);
    const [message, setMessage] = useState('');
   

    const auth = getAuth(app);

    // Once the post request occurs, refresh the page so we can see the changes. 
    const refreshPage = () => {
        window.location.reload();
    }

    //Close popup containing message with status of name update and refresh page 
    const closeStatus = () => {
        setEditStatus(false);
        refreshPage();
    }

    //Open popup to edit name of a cluster
    const openPopup = () => {
        setIsOpen(true);
    }

    //Close popup to edit education level of a cluster
    const closePopup = () => {
        setIsOpen(false);
    }

    //POST request sent to server which specifies particular cluster ID, along with newly-desired name for that Cluster
    const changeClusterName = async () => {
        try {
            const user = auth.currentUser;
            //If logged-in user is staff
            if(user) {
                const token = await user.getIdToken();
                //POST request
                const response = await(fetch('http://localhost:3001/login/staffclusters/clustermanagementpage/edit-cluster-name', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ clusterName, ID })
            }));
            //If POST request goes through, alert user of success and updated name
            if (response.ok) {
                console.log('Cluster updated successfully');
                setIsOpen(false);
                setMessage(`Successfully changed cluster name to: ${clusterName}`);
                setEditStatus(true);
            //Otherwise, alert user of failure and display error message
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


    
    //Return the HTML and elements used to populate Edit Name button, which has functionality to confirm and edit name for a Cluser within SQL database
    return (
        <div id="cluster-button">
                <button className="manage-button" onClick={openPopup}>Edit Name</button>
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