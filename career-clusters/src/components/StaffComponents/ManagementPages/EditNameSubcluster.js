import './ManagementSubCluster.css'
import './ManagementCluster.css'
import React, { useState } from "react";
import { getAuth } from "firebase/auth";
import app from "../../login_components/FirebaseConfig";


const EditNameSubcluster = ({ID}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [subclusterName, setsubclusterName] = useState('');
    const [statusName, setStatusName] = useState(false);
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
        setStatusName(false);
        refreshPage();
    }
   

    const changeSubClusterName = async () => {
        try {
            const user = auth.currentUser;
            if(user) {
                const token = await user.getIdToken();
                const response = await(fetch('http://localhost:3001/subclustermanagementpage/edit-subcluster-name', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ subclusterName, ID })
                }));
                if (response.ok) {
                    console.log('SubCluster name updated successfully');
                    setIsOpen(false);
                    setMessage('Successfully updated SubCluster name.')
                    setStatusName(true);
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

    return (
        <div className="cluster-button">
            <button className="editName" onClick={openPopup}>Edit Name</button>
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