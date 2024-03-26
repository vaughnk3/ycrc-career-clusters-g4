import './ManagementCluster.css';
import React, { useState } from "react";
import { getAuth } from "firebase/auth";
import app from "../../login_components/FirebaseConfig";



const ReplaceImageButton = ({ID}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [newImage, setNewImage] = useState(null);
    const [imageStatus, setImageStatus] = useState(false);
    const [message, setMessage] = useState('');

    const auth = getAuth(app);

    const closeStatus = () => {
        setImageStatus(false);
        refreshPage();
    }

    const openPopup = () => {
        setIsOpen(true);
    }

    const closePopup = () => {
        setIsOpen(false);
    }
   

    const uploadFilePost = async (file, id) => {
        try {
            const formData = new FormData();
            formData.append('image', file);
            formData.append('id', id);
            const user = auth.currentUser;
            if(user) {
                const token = await user.getIdToken();
                const dbResponse = await fetch ('http://localhost:3001/imag-cluster-replace', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    body: formData,
                });


                if (dbResponse.ok) {
                    closePopup()
                    setMessage('Successfully uploaded new SubCluster image.');
                    setImageStatus(true);
                }

                else {
                    closePopup()
                    setMessage('Failed to upload new SubCluster image.')
                    setImageStatus(true);
                }
            }

         
        //const data = await dbResponse.json();
        //console.log('Sucess image post', data);
        } catch (error) {
            console.log("Error", error);
            closePopup()
            setMessage('Failed to upload new SubCluster image.');
            setImageStatus(true);
        }
    }

    const refreshPage = () => {
        window.location.reload();
      }


    const handleFileInputChange = (e) => 
    {
        console.log("HFC: ", e.target.files[0])
        setNewImage(e.target.files[0]);
    }


    const handleSubmit = () => {
        uploadFilePost(newImage, ID);
        //closePopup();
        //refreshPage();
    }


    return (
        <div id="cluster-button">
            <button onClick={openPopup} class="management-button">Replace Image</button>
            {isOpen && (
                <div className="popup">
                    <div className="popup-content">  
                        <label for="img" className='standard-popup'>Replace Image</label>
                        <br/><br/>
                        <input type="file" id="img" name="img" accept="image/*" onChange={handleFileInputChange}></input>
                        <br/>
                        <div class="replacebuttonrow">
                        <button onClick={closePopup} className="standard-cancelButton">Cancel</button>
                        <button id="standard-submitImg" onClick={handleSubmit}>Submit</button>
                        </div>
                    </div>
                </div>
            )}

            {imageStatus && (
                <div className="popup">
                    <div className="popup-content">
                        <h1>{message}</h1>
                        <button onClick={closeStatus}>Acknowledge and Close</button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ReplaceImageButton;




