import './ManagementSubCluster.css'
import './ManagementCluster.css'
import React, { useState } from "react";
import { getAuth } from "firebase/auth";
import app from "../../login_components/FirebaseConfig";

/*
This file contains the Javascript code and POST requests utilized by staff accounts to update the growth rate for any given
subcluster within SQL database. Sends specified subcluster ID, and new growth rate to be updated within Subcluster table 

KJ Vaughn
*/


//React component which recieves corresponding Cluster ID, used by staff to edit growth rate for a Subcluster
const EditGrowthSubCluster = ({ID}) => {

    //State variables to keep track of popup status for updates and errors, along with new growth rate 
    const [isOpen, setIsOpen] = useState(false);
    const [subclusterGrowthRate, setsubclusterGrowthRate] = useState('');
    const [statusGrowth, setStatusGrowth] = useState(false);
    const [message, setMessage] = useState('');

    //Close popup containing message with status of growth rate update and refresh page 
    const closeStatus = () => {
        setStatusGrowth(false);
        refreshPage();
    }

    const auth = getAuth(app);

    //When an option is selected, set the value in subclusterGrowth rate
    const handleSelectChange = (event) => {
        setsubclusterGrowthRate(event.target.value);
    };

    //Open popup function
    const openPopup = () => {
        setIsOpen(true);
    }

    //Close popup function
    const closePopup = () => {
        setIsOpen(false);
    }

    // Once the post request occurs, refresh the page so we can see the changes. 
    const refreshPage = () => {
        window.location.reload();
    }

    
    //POST request sent to server which specifies particular subcluster ID, along with newly-desired growth rate for that Subcluster
    const changeSubClusterGrowthRate = async () => {
        try {
            const user = auth.currentUser;
            //If logged-in user is staff
            if(user) {
                const token = await user.getIdToken();
                const response = await(fetch('http://localhost:3001/subclustermanagementpage/edit-subcluster-growthrate', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ subclusterGrowthRate, ID })
                }));
                //If POST request goes through, alert user of success and updated growth rate
                if (response.ok) {
                    console.log('SubCluster name updated successfully');
                    setIsOpen(false);
                    setMessage('Successfully updated SubCluster Growth Rate.');
                    setStatusGrowth(true);
                //Otherwise, alert user of failure and display error message within popup 
                } else {
                    console.error('Failed to update subcluster name');
                    setIsOpen(false);
                    setMessage('Failed to update SubCluster Growth Rate.')
                    setStatusGrowth(true);
                    
               }    
            }
        }   catch (error) {
            console.error('Error updating subcluster name: ', error);
            setIsOpen(false);
            setMessage('Failed to update SubCluster Growth Rate.')
            setStatusGrowth(true);
            
        }
        //console.log('POST request sent from edit button')
        //setIsOpen(false);
        //refreshPage();
    }

    //Return the HTML and elements used to populate Edit Growth Rate button, which has functionality to confirm and edit growth rate for a Subcluster within SQL database
    return (
        <div className="GrowthRate">
            <button className="management-button" onClick={openPopup}>Edit Growth Rate</button>
            {isOpen && (
                    <div className="popup">
                        <div className="popup-content">
                            <label for="growth-rate" className="standard-popup"><b>Change Growth Rate</b></label>
                            <br/><br/>
                            <select id="growth-rate" name="rate" value={subclusterGrowthRate} onChange={handleSelectChange} >
                                <option>Select Below</option>
                                <option value="High">High</option>
                                <option value="Medium">Medium</option>
                                <option value="Low">Low</option>
                            </select>
                            <br/>
                            <div className="replacebuttonrow">
                            <button onClick={closePopup}>Cancel</button>
                            <button id="standard-submitName" onClick={changeSubClusterGrowthRate}>Submit</button>
                            </div>
                        </div>
                    </div>
            )}

            {statusGrowth && (
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

export default EditGrowthSubCluster;