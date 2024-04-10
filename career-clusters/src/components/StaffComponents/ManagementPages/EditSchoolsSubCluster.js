import './ManagementSubCluster.css'
import './ManagementCluster.css'
import React, { useState } from "react";
import { getAuth} from "firebase/auth";
import app from "../../login_components/FirebaseConfig"


/*
This file contains the Javascript code and POST requests utilized by staff accounts to update the school list for any given
subcluster within SQL database. Sends specified subcluster ID, and new description to be updated within Subcluster table 

KJ Vaughn
*/


const EditSchoolsSubCluster = ( {ID} ) => {

    // State variable to keep track of popup status for updates and errors
    const [isOpen, setIsOpen] = useState(false);
    const [updatedSchools, setUpdatedSchools] = useState('');
    const [status, setStatus] = useState(false);
    const [message, setMessage] = useState('');

    const auth = getAuth(app);

    //Open popup to edit school list of a subcluster
    const openPopup = () => {
        setIsOpen(true);
    }

    //Close popup to edit school list of a subcluster
    const closePopup = () => {
        setIsOpen(false);
    }

    //Function to refresh page 
    const refreshPage = () => {
        window.location.reload();
    }

    const closeStatus = () => {
        setStatus(false);
        refreshPage();
    }


    //  /subclustermanagementpage/change-schools

    const changeSchoolList = async () => {
        try {
            const user = auth.currentUser;

            if (user) {
                const token = await user.getIdToken();
                const response = await(fetch('http://localhost:3001/subclustermanagementpage/change-schools', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify( {updatedSchools, ID} )
                }));

                if (response.ok) {
                    console.log('Successful school list post');
                    setIsOpen(false);
                    setMessage('Sucessfully updated SubCluster School List.');
                    setStatus(true);
                }
                else {
                    console.error('Failed to update SubCluster School List.');
                    setIsOpen(false);
                    setMessage('Failed to update SubCluster School List.');
                    setStatus(true);
                }
            }
        }
        catch (error) {
            console.error('Failed to update SubCluster School List.');
            setIsOpen(false);
            setMessage('Failed to update SubCluster School List.');
            setStatus(true);
        }
    }


    //Return the HTML and elements used to populate Edit Description button, which has functionality to confirm and edit description for a Subcluster within SQL database
    return (
        <div className="cluster-button">
            <button className="management-button" onClick={openPopup}>Edit Schools</button>
            { isOpen && (
                <div className="popup">
                    <div className="popup-content">
                        <label className='standard-popup'>Edit School List</label>
                        <br></br>
                        <br></br>
                        <textarea id="subclusterDescrip" type="text" className="standardIn-popup" maxLength="300" placeholder='Enter the changed School List here' value={updatedSchools} onChange={(e) => setUpdatedSchools(e.target.value)}></textarea>
                        <br></br>
                        <br></br>
                        <br></br>
                        <button onClick={closePopup}>Cancel</button>
                        <button onClick={changeSchoolList}>Submit</button>
                    </div>
                </div>
            )}
            

            { status && (
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


// Export the completed component
export default EditSchoolsSubCluster;