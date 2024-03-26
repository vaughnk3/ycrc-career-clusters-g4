import './ManagementSubCluster.css'
import './ManagementCluster.css'
import React, { useState } from "react";
import { getAuth} from "firebase/auth";
import app from "../../login_components/FirebaseConfig"

const EditDescriptionSubcluster = ({ID}) => {

    const [isOpen, setIsOpen] = useState(false);
    const [subclusterDescrip, setsubclusterDescrip] = useState('');
    const [statusDescrip, setStatusDescrip] = useState(false);
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
        setStatusDescrip(false);
        refreshPage();
    }

    const changeSubClusterDescrip = async () => {
        try {
            const user = auth.currentUser;
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
                if (response.ok) {
                    console.log('SubCluster name updated successfully');
                    setIsOpen(false);
                    setMessage('Sucessfully updated SubCluster description.');
                    setStatusDescrip(true);
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

    return (
        <div className="Description">
            <button className="editDescription" onClick={openPopup}>Edit Description</button>
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