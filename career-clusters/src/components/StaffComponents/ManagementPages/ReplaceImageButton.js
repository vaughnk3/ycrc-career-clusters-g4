import './ManagementCluster.css';
import React, { useState } from "react";
import { getAuth } from "firebase/auth";
import app from "../../login_components/FirebaseConfig";

/*
This file contains the Javascript code and POST requests utilized by staff accounts to update the image for any given
cluster within SQL database. Sends new cluster image to be updated within Cluster table 

KJ Vaughn
*/

//React component which recieves particular selected cluster ID, used by staff to edit image for a Cluster
const ReplaceImageButton = ({ID}) => {

    //State variable to keep track of popup status for updates and errors, along with new cluster image  
    const [isOpen, setIsOpen] = useState(false);
    const [newImage, setNewImage] = useState(null);
    const [imageStatus, setImageStatus] = useState(false);
    const [message, setMessage] = useState('');

    const auth = getAuth(app);

    //Close popup containing message with status of image update and refresh page 
    const closeStatus = () => {
        setImageStatus(false);
        refreshPage();
    }

    //Open popup to edit image of a cluster
    const openPopup = () => {
        setIsOpen(true);
    }

    //Close popup to edit image of a cluster
    const closePopup = () => {
        setIsOpen(false);
    }
   
    //POST request sent to server which specifies particular cluster ID, along with new file input by user to be used as image for that Cluster
    const uploadFilePost = async (file, id) => {
        try {
            const formData = new FormData();
            formData.append('image', file);
            formData.append('id', id);
            const user = auth.currentUser;
            //If logged-in user is staff
            if(user) {
                const token = await user.getIdToken();
                //POST request 
                const dbResponse = await fetch ('http://localhost:3001/imag-cluster-replace', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    body: formData,
                });

                //If POST request goes through, alert user of success and updated image
                if (dbResponse.ok) {
                    closePopup()
                    setMessage('Successfully uploaded new Cluster image.');
                    setImageStatus(true);
                }
                //Otherwise, alert user of failure and display error message
                else {
                    closePopup()
                    setMessage('Failed to upload new Cluster image.')
                    setImageStatus(true);
                }
            }

         
        //const data = await dbResponse.json();
        //console.log('Sucess image post', data);
        } catch (error) {
            console.log("Error", error);
            closePopup()
            setMessage('Failed to upload new Cluster image.');
            setImageStatus(true);
        }
    }

    //Function to refresh page 
    const refreshPage = () => {
        window.location.reload();
      }


    //If user specifies a new image to be used as input 
    const handleFileInputChange = (e) => 
    {
        console.log("HFC: ", e.target.files[0])
        setNewImage(e.target.files[0]);
    }

    //Upon submission, update state of with new image to be updated and close popup
    const handleSubmit = () => {
        uploadFilePost(newImage, ID);
        //closePopup();
        //refreshPage();
    }

    //Return the HTML and elements used to populate Edit Image button, which has functionality to display dialogue box, confirm,
    //and update image for a Cluster within SQL database
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
                        <button onClick={closePopup}>Cancel</button>
                        <button id="standard-submitImg" onClick={handleSubmit}>Submit</button>
                        </div>
                    </div>
                </div>
            )}

            {imageStatus && (
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

export default ReplaceImageButton;




