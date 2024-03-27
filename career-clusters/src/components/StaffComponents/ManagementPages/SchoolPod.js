import React, { useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import app from "../../login_components/FirebaseConfig"
import './SchoolManagementPage.css'

const SchoolPod = ({ID, schoolName}) => {
    console.log(schoolName, " ", ID)
    const [isOpen, setIsOpen] = useState(false);
    const [isOpen2, setIsOpen2] = useState(false);
    const [errorOpenName, setErrorOpenName] = useState(false);
    const [errorOpenDelete, setErrorOpenDelete] = useState(false);
    const [newSchoolName, setSchoolName] = useState('');

    const auth = getAuth(app);

    const openPopup = () => {
        setIsOpen(true);
    }

    const closePopup = () => {
        setIsOpen(false);
    }

    const refreshPage = () => {
        window.location.reload();
    }

    const openPopup2 = () => {
        setIsOpen2(true);
    }

    const closePopup2 = () => {
        setIsOpen2(false);
    }

    const closeErrorPopupName = () => {
        setErrorOpenName(false);
        refreshPage();
    }


    const closeErrorDelete = () => {
        setErrorOpenDelete(false);
        refreshPage();
    }



    const changeSchoolName = async () => {
        try {
            const user = auth.currentUser;
            if(user) {
                const token = await user.getIdToken();
                console.log(newSchoolName, ":", ID)
                const response = await(fetch('http://localhost:3001/manage-school-name', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ newSchoolName, ID })
                }));
                if (response.ok) {
                    console.log('School name updated successfully');
                    console.log('POST request sent from edit button')
                    setIsOpen(false);
                    // refreshPage();
            
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


    const handleDeleteSchool = async () => {
        try {
            const user = auth.currentUser;
            if(user) {
                const token = await user.getIdToken();
                const response = await(fetch('http://localhost:3001/del-school', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ ID })
                }));
                if (response.ok) {
                    console.log('School deleted successfully');
                    setIsOpen2(false);
                    // refreshPage();
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
    return (
        <div id="school_pod">
            <h1>{schoolName}</h1>
            <div id="school-pod-buttons">
                <button onClick={openPopup} id="edit_school_name">Edit School Name</button>
                <button onClick={openPopup2}>Delete</button>
            </div>

            {isOpen && (
                    <div className="popup">
                        <div className="popup-content">
                         
                            <label>Edit Name</label>
                            <br/><br/>
                            <input type="text" id="new-school" name="newSchoolName" placeholder="Enter the new school name." value={newSchoolName} onChange={(e) => setSchoolName(e.target.value)}></input>
                            <br/><br/>
                            <button className="cancelButton" onClick={closePopup}>Cancel</button>
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