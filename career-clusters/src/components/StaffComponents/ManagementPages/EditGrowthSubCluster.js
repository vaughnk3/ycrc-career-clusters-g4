import './ManagementSubCluster.css'
import './ManagementCluster.css'
import React, { useState } from "react";
import { getAuth } from "firebase/auth";
import app from "../../login_components/FirebaseConfig";


const EditGrowthSubCluster = ({ID}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [subclusterGrowthRate, setsubclusterGrowthRate] = useState('');
    const [statusGrowth, setStatusGrowth] = useState(false);
    const [message, setMessage] = useState('');

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

    

    const changeSubClusterGrowthRate = async () => {
        try {
            const user = auth.currentUser;
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
                if (response.ok) {
                    console.log('SubCluster name updated successfully');
                    setIsOpen(false);
                    setMessage('Successfully updated SubCluster Growth Rate.');
                    setStatusGrowth(true);
                    
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


    return (
        <div className="GrowthRate">
            <button className="editGrowthRate" onClick={openPopup}>Edit Growth Rate</button>
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
                            <button onClick={closePopup} className="standard-cancelButton">Cancel</button>
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