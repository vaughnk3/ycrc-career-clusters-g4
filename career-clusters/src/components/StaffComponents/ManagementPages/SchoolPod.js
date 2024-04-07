import React, { useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import app from "../../login_components/FirebaseConfig"
import './SchoolManagementPage.css'

/*This file contains the JavaScript code and POST requests utilized by staff for the deletion and modification of schools within
SQL database. Sends particular school ID to be Deleted or school ID and newly-desired name to be updated within School table.

KJ Vaughn
*/
const SchoolPod = ({ID, schoolName}) => {
    console.log(schoolName, " ", ID)
    const [isOpen, setIsOpen] = useState(false);
    const [isOpen2, setIsOpen2] = useState(false);
    const [errorOpenName, setErrorOpenName] = useState(false);
    const [errorOpenDelete, setErrorOpenDelete] = useState(false);
    const [newSchoolName, setSchoolName] = useState('');

    const auth = getAuth(app);

    //Change state for addition of school popup to open
    const openPopup = () => {
        setIsOpen(true);
    }

    //Change state for addition of school popup to close
    const closePopup = () => {
        setIsOpen(false);
    }

    //Refresh the page
    const refreshPage = () => {
        window.location.reload();
    }

    //Change state for deletion of school popup to open
    const openPopup2 = () => {
        setIsOpen2(true);
    }

    //Change state for deletion of school popup to close
    const closePopup2 = () => {
        setIsOpen2(false);
    }

    //Change state for new school name and refresh page 
    const closeErrorPopupName = () => {
        setErrorOpenName(false);
        refreshPage();
    }

    //Change state for deletion error and refresh page 
    const closeErrorDelete = () => {
        setErrorOpenDelete(false);
        refreshPage();
    }


    //POST request sent to server which specifies school ID and updated name of school to be changed for that ID within School SQL table
    const changeSchoolName = async () => {
        try {
            const user = auth.currentUser;
            //If logged-in user is staff
            if(user) {
                const token = await user.getIdToken();
                console.log(newSchoolName, ":", ID)
                //POST request 
                const response = await(fetch('http://localhost:3001/manage-school-name', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ newSchoolName, ID })
                }));
                //If POST request goes through, alert user of success
                if (response.ok) {
                    console.log('School name updated successfully');
                    console.log('POST request sent from edit button')
                    setIsOpen(false);
                    // refreshPage();
                //Otherwise, alert user of failure 
                } else {
                    console.error('Failed to update school name');
                    setIsOpen(false);
                    setErrorOpenName(true);
                }
            } 
        }   catch (error) {
            console.error('Error updating school name: ', error);
            setIsOpen(false);
            setErrorOpenName(true);
        }
        //console.log('POST request sent from edit button')
        //setIsOpen(false);
        //refreshPage();
    }

    //Send POST request to server which specifies particular school to be removed from School SQL table 
    const handleDeleteSchool = async () => {
        try {
            const user = auth.currentUser;
            //If logged-in user is staff
            if(user) {
                const token = await user.getIdToken();
                //POST request
                const response = await(fetch('http://localhost:3001/del-school', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ ID })
                }));
                //If POST request goes through, alert user of success
                if (response.ok) {
                    console.log('School deleted successfully');
                    setIsOpen2(false);
                     refreshPage();
                //Otherwise, alert user of failure and change state for error popup
                } else {
                    console.error('Failed to delete school');
                    setIsOpen2(false);
                    setErrorOpenDelete(true);
                    
                } 
            }
        }   catch (error) {
            console.error('Error deleting school: ', error);
            setIsOpen2(false);
            setErrorOpenDelete(true);
        }
        //console.log('POST request sent from delete school')
        //setIsOpen(false);
        //refreshPage();
    }
    //Return the HTML and elements of structure to populate buttons, functionality, and confirmation for Edit School Name, and Deletion of particular School from SQL database
    return (
        <div id="school_pod">
            <h1>{schoolName}</h1>
            <div id="school-pod-buttons">
                <button onClick={openPopup} className="management-button">Edit School Name</button>
                <button onClick={openPopup2}className="management-button">Delete</button>
            </div>

            {isOpen && (
                    <div className="popup">
                        <div className="popup-content">
                         
                            <label>Edit Name</label>
                            <br/><br/>
                            <input type="text" id="new-school" name="newSchoolName" placeholder="Enter the new school name." value={newSchoolName} onChange={(e) => setSchoolName(e.target.value)}></input>
                            <br/><br/>
                            <button onClick={closePopup}>Cancel</button>
                            <button onClick={changeSchoolName}>Submit</button>
                        </div>
                    </div>
                )}
            {isOpen2 && (
                <div className="popup">
                    <div className="popup-content">
                        <label>Are you sure you want to delete this school?</label>
                        <br/><br/>
                        <button onClick={closePopup2}>Cancel</button>
                        <button onClick={handleDeleteSchool}>Delete</button>
                    </div>
                </div>
            )}

            {errorOpenName && (
                <div className="popup">
                    <div className="popup-content">
                        <h1>Error</h1>
                        <p>An error has occured changing the school name.</p>
                        <button onClick={closeErrorPopupName}>Acknowledge and Refresh</button>
                    </div>
                </div>
            )}

            {errorOpenDelete && (
                <div className="popup">
                    <div className="popup-content">
                        <h1>Error</h1>
                        <p>An error has occured deleting the school</p>
                        <button onClick={closeErrorDelete}>Acknowledge and Refresh</button>
                    </div>
                </div>
            )}

        </div>
    )
}

export default SchoolPod;