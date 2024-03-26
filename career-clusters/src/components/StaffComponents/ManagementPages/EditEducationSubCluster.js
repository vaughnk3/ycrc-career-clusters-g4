import './ManagementSubCluster.css'
import './ManagementCluster.css'
import React, { useState } from "react";
import { getAuth } from "firebase/auth";
import app from "../../login_components/FirebaseConfig";

const EditEducationSubCluster = ({ID}) => {

    const [isOpen, setIsOpen] = useState(false);
    const [subclusterEducation, setsubclusterEducation] = useState('');
    const [statusEduc, setStatusEduc] = useState(false);
    const [message, setMessage] = useState('');

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

    const closeStatus = () => {
        setStatusEduc(false);
        refreshPage();
    }


    const changeSubClusterEducation = async () => {
        try {
            const user = auth.currentUser;
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
                if (response.ok) {
                    console.log('SubCluster name updated successfully');
                    setIsOpen(false);
                    setMessage('Successfully updated SubCluster education level.');
                    setStatusEduc(true);
                    
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



    return (
        <div className="Education">
            <button className="editEducation" onClick={openPopup}>Edit Education Level</button>
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
