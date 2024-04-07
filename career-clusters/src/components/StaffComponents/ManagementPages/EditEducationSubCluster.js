import './ManagementSubCluster.css'
import './ManagementCluster.css'
import React, { useState } from "react";
import { getAuth } from "firebase/auth";
import app from "../../login_components/FirebaseConfig";

/*
This file contains the Javascript code and POST requests utilized by staff accounts to update the education level for any given
subcluster within SQL database. Sends specified subcluster ID, and new education level to be updated within Subcluster table 

KJ Vaughn
*/

//React component which recieves corresponding Cluster ID, used by staff to edit education level for a Subcluster
const EditEducationSubCluster = ({ID}) => {

    //State variable to keep track of popup status for updates and errors, along with new education level 
    const [isOpen, setIsOpen] = useState(false);
    const [subclusterEducation, setsubclusterEducation] = useState('');
    const [statusEduc, setStatusEduc] = useState(false);
    const [message, setMessage] = useState('');

    const auth = getAuth(app);


    //Open popup to edit educaiton level of a subcluster
    const openPopup = () => {
        setIsOpen(true);
    }

    //Close popup to edit education level of a subcluster
    const closePopup = () => {
        setIsOpen(false);
    }

    //Function to refresh page 
    const refreshPage = () => {
        window.location.reload();
    }

    //Close popup containing message with status of education level update and refresh page 
    const closeStatus = () => {
        setStatusEduc(false);
        refreshPage();
    }

    //POST request sent to server which specifies particular subcluster ID, along with newly-desired education level for that Subcluster
    const changeSubClusterEducation = async () => {
        try {
            const user = auth.currentUser;
            //If logged-in user is staff
            if(user) {
                const token = await user.getIdToken();
                const response = await(fetch('http://localhost:3001/subclustermanagementpage/edit-subcluster-education', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ subclusterEducation, ID })
                }));
                //If POST request goes through, alert user of success and updated education level 
                if (response.ok) {
                    console.log('SubCluster name updated successfully');
                    setIsOpen(false);
                    setMessage('Successfully updated SubCluster education level.');
                    setStatusEduc(true);
                //Otherwise, alert user of failure and display error message
                } else {
                    console.error('Failed to update subcluster name');
                    setIsOpen(false);
                    setMessage('Failed to update SubCluster education level.');
                    setStatusEduc(true);
                    
                } 
            }
        }   catch (error) {
            console.error('Error updating subcluster name: ', error);
            setIsOpen(false);
            setMessage('Failed to update SubCluster education level.');
            setStatusEduc(true);
            
        }
        //console.log('POST request sent from edit button')
        //setIsOpen(false);
        //refreshPage();
    }


    //Return the HTML and elements used to populate Edit Education Level button, which has functionality to confirm and edit education level for a Subcluster within SQL database
    return (
        <div className="Education">
            <button className="management-button" onClick={openPopup}>Edit Education Level</button>
            {isOpen && (
                    <div className="popup">
                        <div className="popup-content">  
                            <label for="subclusterEducation" className="standard-popup">Edit Education Level</label>
                            <br/><br/>
                            <input type="text" id="subclusterEducation" className="standardIn-popup" name="subclusterEducation" placeholder="Enter the changed SubCluster education level." value={subclusterEducation} onChange={(e) => setsubclusterEducation(e.target.value)}></input>
                            <br/>
                            <div className='replacebuttonrow'>
                            <button onClick={closePopup} className="standard-cancelButton">Cancel</button>
                            <button id="standard-submitName" onClick={changeSubClusterEducation}>Submit</button>
                            </div>
                        </div>
                    </div>
            )}

            {statusEduc && (
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


export default EditEducationSubCluster;
