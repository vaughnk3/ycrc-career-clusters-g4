import './ManagementSubCluster.css'
import './ManagementCluster.css'
import React, { useState } from "react";
import { getAuth } from "firebase/auth";
import app from "../../login_components/FirebaseConfig";

/*
This file contains the Javascript code and POST requests utilized by staff accounts to update the salary for any given
subcluster within SQL database. Sends specified subcluster ID, and new salary to be updated within Subcluster table 

KJ Vaughn
*/

//React component which recieves corresponding Subcluster ID, used by staff to edit salary for a Subcluster
const EditSalarySubCluster = ({ID}) => {

    //State variable to keep track of popup status for updates and errors, along with new salary
    const [isOpen, setIsOpen] = useState(false);
    const [subclusterSalary, setsubclusterSalary] = useState(0);
    const [statusSalary, setStatusSalary] = useState(false);
    const [message, setMessage] = useState('');

    const auth = getAuth(app);


    //Open popup to edit salary of a subcluster
    const openPopup = () => {
        setIsOpen(true);
    }

    //Close popup to edit salary of a subcluster
    const closePopup = () => {
        setIsOpen(false);
    }

    //Function to refresh page 
    const refreshPage = () => {
        window.location.reload();
    }

    //Close popup containing message with status of salary update and refresh page 
    const closeStatus = () => {
        setStatusSalary(false);
        refreshPage();
    }
    
    //POST request sent to server which specifies particular subcluster ID, along with newly-desired salary for that Subcluster
    const changeSubClusterSalary = async () => {
        try {
            const user = auth.currentUser;
            //If logged-in user is staff
            if(user) {
                const token = await user.getIdToken();
                //POST request
                const response = await(fetch('http://localhost:3001/subclustermanagementpage/edit-subcluster-salary', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ subclusterSalary, ID })
                }));
                //If POST request goes through, alert user of success and updated salary
                if (response.ok) {
                    console.log('SubCluster name updated successfully');
                    setIsOpen(false);
                    setMessage('Successfully changed the SubCluster Salary.');
                    setStatusSalary(true);
                //Otherwise, alert user of failure and display error message 
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

    const handleSalaryChange = (event) => {
        var salary = event.target.value;
        if (salary >= 0 && salary <= 8000000)
            setsubclusterSalary(salary);
    }

    //Return the HTML and elements used to populate Edit Salary button, which has functionality to confirm and edit salary for a Subcluster within SQL database
    return (
        <div className="cluster-button">
            <button className="management-button" onClick={openPopup}>Edit Salary</button>
            {isOpen && (
                    <div className="popup">
                        <div className="popup-content">  
                            <label for="subclusterSalary" className="standard-popup">Salary</label>
                            <p>Enter a whole number (80000, not $80,000)</p>
                            <input type="number" id="subclusterSalary" className="standardIn-popup" name="subclusterSalary" placeholder="Enter the changed SubCluster salary." value={subclusterSalary} onChange={handleSalaryChange}></input>
                            <br/>
                            <div className="replacebuttonrow">
                            <button onClick={closePopup}>Cancel</button>
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