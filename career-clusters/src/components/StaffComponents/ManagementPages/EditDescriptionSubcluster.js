import './ManagementSubCluster.css'
import './ManagementCluster.css'
import React, { useState } from "react";
import { getAuth} from "firebase/auth";
import app from "../../login_components/FirebaseConfig"

/*
This file contains the Javascript code and POST requests utilized by staff accounts to update the description for any given
subcluster within SQL database. Sends specified subcluster ID, and new description to be updated within Subcluster table 

KJ Vaughn
*/

//React component which recieves corresponding Cluster ID, used by staff to edit description for a Subcluster
const EditDescriptionSubcluster = ({ID}) => {

    //State variable to keep track of popup status for updates and errors, along with new description 
    const [isOpen, setIsOpen] = useState(false);
    const [subclusterDescrip, setsubclusterDescrip] = useState('');
    const [statusDescrip, setStatusDescrip] = useState(false);
    const [message, setMessage] = useState('');

    const auth = getAuth(app);

    //Open popup to edit description of a subcluster
    const openPopup = () => {
        setIsOpen(true);
    }

    //Close popup to edit description of a subcluster
    const closePopup = () => {
        setIsOpen(false);
    }

    //Function to refresh page 
    const refreshPage = () => {
        window.location.reload();
    }

    //Close popup containing message with status of description update and refresh page 
    const closeStatus = () => {
        setStatusDescrip(false);
        refreshPage();
    }

    //POST request sent to server which specifies particular subcluster ID, along with newly-desired description for that Subcluster
    const changeSubClusterDescrip = async () => {
        try {
            const user = auth.currentUser;
            //If logged-in user is staff
            if(user){
                const token = await user.getIdToken();
                const response = await(fetch('http://localhost:3001/subclustermanagementpage/edit-subcluster-descrip', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ subclusterDescrip, ID })
                }));
                //If POST request goes through, alert user of success and updated description 
                if (response.ok) {
                    console.log('SubCluster name updated successfully');
                    setIsOpen(false);
                    setMessage('Sucessfully updated SubCluster description.');
                    setStatusDescrip(true);
                //Otherwise, alert user of failure within popup and display error message
                } else {
                    console.error('Failed to update subcluster name');
                    setIsOpen(false);
                    setMessage('Failed to update SubCluster description.')
                    setStatusDescrip(true);
                } 
            }
        }   catch (error) {
            console.error('Error updating subcluster name: ', error);
            setIsOpen(false);
            setMessage('Failed to update SubCluster description.')
            setStatusDescrip(true);
        }
        //console.log('POST request sent from edit button')
        //setIsOpen(false);
        //refreshPage();
    }

    //Return the HTML and elements used to populate Edit Description button, which has functionality to confirm and edit description for a Subcluster within SQL database
    return (
        <div className="Description">
            <button className="manage-button" onClick={openPopup}>Edit Description</button>
            {isOpen && (
                    <div className="popup">
                        <div className="popup-content">  
                            <label for='subclusterDescrip' className='standard-popup'>Edit Description</label>
                            <br/><br/>
                            <textarea type="text" className="standardIn-popup" maxLength="200" id="subclusterDescrip" name="subclusterDescrip" placeholder="Enter the changed SubCluster description." value={subclusterDescrip} onChange={(e) => setsubclusterDescrip(e.target.value)}></textarea>
                            <br/>
                            <div className='replacebuttonrow'>
                            <button onClick={closePopup} className="standard-cancelButton">Cancel</button>
                            <button id="standard-submitName" onClick={changeSubClusterDescrip}>Submit</button>
                            </div>
                        </div>
                    </div>
            )}

            {statusDescrip && (
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


export default EditDescriptionSubcluster;