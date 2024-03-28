import './ManagementSubCluster.css'
import './ManagementCluster.css'
import React, { useState } from "react";
import { getAuth } from "firebase/auth";
import app from "../../login_components/FirebaseConfig";

const EditSalarySubCluster = ({ID}) => {

    const [isOpen, setIsOpen] = useState(false);
    const [subclusterSalary, setsubclusterSalary] = useState(0);
    const [statusSalary, setStatusSalary] = useState(false);
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
        setStatusSalary(false);
        refreshPage();
    }
    

    const changeSubClusterSalary = async () => {
        try {
            const user = auth.currentUser;
            if(user) {
                const token = await user.getIdToken();
                const response = await(fetch('http://localhost:3001/subclustermanagementpage/edit-subcluster-salary', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ subclusterSalary, ID })
                }));
                if (response.ok) {
                    console.log('SubCluster name updated successfully');
                    setIsOpen(false);
                    setMessage('Successfully changed the SubCluster Salary.');
                    setStatusSalary(true);
                    
                } else {
                    console.error('Failed to update subcluster name');
                    setIsOpen(false);
                    setMessage('Failed to change SubCluster Salary');
                    setStatusSalary(true);
                    
                } 
            }
        }   catch (error) {
            console.error('Error updating subcluster name: ', error);
            setIsOpen(false);
            setMessage('Failed to change SubCluster Salary');
            setStatusSalary(true);
            
        }
        //console.log('POST request sent from edit button')
        //setIsOpen(false);
        //refreshPage();
    }

    return (
        <div className="cluster-button">
            <button className="editSalary" onClick={openPopup}>Edit Salary</button>
            {isOpen && (
                    <div className="popup">
                        <div className="popup-content">  
                            <label for="subclusterSalary" className="standard-popup">Salary</label>
                            <br/><br/>
                            <input type="number" id="subclusterSalary" className="standardIn-popup" name="subclusterSalary" placeholder="Enter the changed SubCluster salary." value={subclusterSalary} onChange={(e) => setsubclusterSalary(e.target.value)}></input>
                            <br/>
                            <div className="replacebuttonrow">
                            <button onClick={closePopup} className="standard-cancelButton">Cancel</button>
                            <button id="standard-submitName" onClick={changeSubClusterSalary}>Submit</button>
                            </div>
                        </div>
                    </div>
            )}

            {statusSalary && (
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


export default EditSalarySubCluster;