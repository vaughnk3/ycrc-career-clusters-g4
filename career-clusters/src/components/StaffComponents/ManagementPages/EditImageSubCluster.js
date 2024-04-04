import './ManagementCluster.css';
import { useState } from 'react';
import { getAuth } from "firebase/auth";
import app from "../../login_components/FirebaseConfig"

/*
This file contains the Javascript code and POST requests utilized by staff accounts to update the image for any given
subcluster within SQL database. Sends specified subcluster ID, and new image to be updated within Subcluster table 

KJ Vaughn
*/

//React component which recieves corresponding Cluster ID, used by staff to edit image for a Subcluster
const EditImageSubCluster = ({ID}) => {
   
    //State variables to keep track of popup status for updates and errors, along with new image
    const [isOpen, setIsOpen] = useState(false);
    const [newImage, setNewImage] = useState(null);
    const [statusImage, setStatusImage] = useState(false);
    const [message, setMessage] = useState('');

    const auth = getAuth(app);

    //Open popup to edit image of a subcluster
    const openPopup = () => {
        setIsOpen(true);
    }

    //Close popup to edit image of a subcluster
    const closePopup = () => {
        setIsOpen(false);
    }

    //Function to refresh page 
    const refreshPage = () => {
        window.location.reload();
    }

    //Close popup containing message with status of image update and refresh page 
    const closeStatus = () => {
        setStatusImage(false);
        refreshPage();
    }

    //POST request sent to server which specifies particular subcluster ID, along with new file input by user to be used as image for that Subcluster
    const uploadFilePost = async (file, id) => {
        try {
            const formData = new FormData();
            formData.append('image', file);
            formData.append('id', id);
            const user = auth.currentUser;
            //If logged-in user is staff
            if(user) {
                const token = await user.getIdToken();
                const dbResponse = await fetch ('http://localhost:3001/subimage-replace', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    body: formData
        
                });
                
                //If POST request goes through, alert user of success and updated image
                if (dbResponse.ok) {
                    console.log('SubCluster name updated successfully');
                    setIsOpen(false);
                    setMessage('Successfully updated SubCluster Image.')
                    setStatusImage(true);
                //Otherwise, alert user of failure and display error message
                } else {
                    console.error('Failed to update subcluster name');
                    setIsOpen(false);
                    setMessage('Failed to update SubCluster Image.');
                    setStatusImage(true);
                           
               } 
            }
        } catch (error) {
            console.log("Error", error);
            setIsOpen(false);
            setMessage('Failed to update SubCluster Image.');
            setStatusImage(true);
        }
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
        closePopup();
    }


   
    //Return the HTML and elements used to populate Edit Image button, which has functionality to display dialogue box, confirm,
    //and update image for a Subcluster within SQL database
    return (
        <div className="Image">
            <button className="manage-button" onClick={openPopup}>Edit Image</button>
            {isOpen && (
                <div className="popup">
                    <div className="popup-content">  
                        <label for="img" className='standard-popup'>Replace Image</label>
                        <br/><br/>
                        <input type="file" id="img" name="img" accept="image/*" className='standardIn-popup' onChange={handleFileInputChange}></input>
                        <br/>
                        <div class="replacebuttonrow">
                        <button onClick={closePopup} className="standard-cancelButton">Cancel</button>
                        <button id="standard-submitImg" onClick={handleSubmit}>Submit</button>
                        </div>
                    </div>
                </div>
            )}

            {statusImage && (
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


export default EditImageSubCluster;