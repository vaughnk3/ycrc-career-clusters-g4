import './ManagementSubCluster.css'
import './ManagementCluster.css'
import React, { useState } from "react";
import { getAuth } from "firebase/auth";
import app from "../../login_components/FirebaseConfig";


/*
This file contains the Javascript code and POST requests utilized by staff accounts to update the name for any given
subcluster within SQL database. Sends new cluster name and corresponding Subcluster ID to be updated within Subcluster table 

KJ Vaughn
*/

//React component which recieves particular selected Subcluster ID, used by staff to edit name for a Subcluster
const EditNameSubcluster = ({ID}) => {

    //State variable to keep track of popup status for updates and errors, along with new subcluster name  
    const [isOpen, setIsOpen] = useState(false);
    const [subclusterName, setsubclusterName] = useState('');
    const [statusName, setStatusName] = useState(false);
    const [message, setMessage] = useState('');

    const auth = getAuth(app);

    //Open popup to edit name of a cluster
    const openPopup = () => {
        setIsOpen(true);
    }

    //Close popup to edit education level of a cluster
    const closePopup = () => {
        setIsOpen(false);
    }

    // Once the post request occurs, refresh the page so we can see the changes. 
    const refreshPage = () => {
        window.location.reload();
    }

    //Close popup containing message with status of name update and refresh page 
    const closeStatus = () => {
        setStatusName(false);
        refreshPage();
    }
   
    //POST request sent to server which specifies particular subcluster ID, along with newly-desired name for that Subcluster
    const changeSubClusterName = async () => {
        try {
            const user = auth.currentUser;
            //If logged-in user is staff
            if(user) {
                const token = await user.getIdToken();
                //POST request
                const response = await(fetch('http://localhost:3001/subclustermanagementpage/edit-subcluster-name', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ subclusterName, ID })
                }));
                //If POST request goes through, alert user of success and updated name
                if (response.ok) {
                    console.log('SubCluster name updated successfully, ', subclusterName);
                    setIsOpen(false);
                    setMessage(`Successfully updated SubCluster name to: ${subclusterName}`)
                    setStatusName(true);
                //Otherwise, alert user of failure and display error message
                } else {
                    console.error('Failed to update subcluster name');
                    setIsOpen(false);
                    setMessage('Failed to update SubCluster name.')
                    setStatusName(true);
                    
                } 
            }
        }   catch (error) {
            console.error('Error updating subcluster name: ', error);
            setIsOpen(false);
            setMessage('Failed to update SubCluster name.')
            setStatusName(true);
            
        }
        //console.log('POST request sent from edit button')
        //setIsOpen(false);
        //refreshPage();
    }

    //Return the HTML and elements used to populate Edit Name button, which has functionality to confirm and edit name for a Subcluser within SQL database
    return (
        <div className="cluster-button">
            <button className="management-button" onClick={openPopup}>Edit Name</button>
            {isOpen && (
                    <div className="popup">
                        <div className="popup-content">
                         
                            <label for="subclusterName" className="standard-popup"><b>Edit Subcluster Name</b></label>
                            <br/><br/>
                            <input type="text" id="subclusterName" name="subclusterName" className='standardIn-popup' placeholder="Enter the SubCluster name." value={subclusterName} onChange={(e) => setsubclusterName(e.target.value)}></input>
                            <br/>
                            <div className="replacebuttonrow">
                            <button onClick={closePopup} className="standard-cancelButton">Cancel</button>
                            <button id="standard-submitName" onClick={changeSubClusterName}>Submit</button>
                            </div>
                        </div>
                    </div>
                )}


                {statusName && (
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


export default EditNameSubcluster;