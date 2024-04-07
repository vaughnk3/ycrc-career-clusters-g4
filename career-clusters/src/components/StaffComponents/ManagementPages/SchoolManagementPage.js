import { useNavigate } from 'react-router-dom'
import './SchoolManagementPage.css';
import React, { useState, useEffect } from "react";
import SchoolPod from './SchoolPod';
import BottomRectangle from '../../page_Components/BottomRectangle';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import app from "../../login_components/FirebaseConfig"


/*
This file contains the Javascript code, GET requests, and POST requests utilized by staff accounts to fetch and update the schools list
within SQL database. Returns list of current schools, and if prompted, sends new school to be added to School table.
Components:
SchoolPod
BottomRectangle

KJ Vaughn
*/

//React component used by staff to fetch and add schools
const SchoolManagementPage = () => {

    //State variables to keep track of popup status for updates and errors, along with optional new school
    const navigate = useNavigate();
    const auth = getAuth(app);
    const [schools, setSchools] = useState([]);
    const [newSchool, setNewSchool] = useState('')
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    //Send GET request to server to fetch all current schools within School SQL table 
    useEffect(() => {
        const fetchSchools = async () => {
            try { 
                const response = await (fetch('http://localhost:3001/school'));
                if(!response.ok) {
                    setLoading(false);
                    setError(true);
                    throw new Error('Error fetching schools');
                }
                const data = await response.json();
                //console.log(data)
                //Render schools
                setSchools(data);
                setLoading(false);
            //Otherwise set error
            } catch (error) {
                console.error('Error: ', error);
                setLoading(false);
                setError(true);
            }
        }
        fetchSchools();
    }, []);
    
    //Set loading animation if rendering is taking too long
    if (loading) {
        return <div id="loading-animation"></div>
    }

    //Force navigation to main staff cluster view if internal back arrow is clicked
    const backButtonHandler = () => {
        navigate('/login/staffclusters/')
    }

     //Open the popup to add school
     const openPopup = () => {
        setIsOpen(true);
    }

    //Close the popup to close school
    const closePopup = () => {
        setIsOpen(false);
    }

    //Refresh the page function when an add is done
    const refreshPage = () => {
        window.location.reload();
      }

    //Close error popup and refresh paage
    const closeError = () => {
        setError(false);
        refreshPage();
    }


    //POST request sent to server which specifies name of new school to be added to the School SQL table
    const addNewSchool = async () => {
        try {
            const user = auth.currentUser;
            //If logged-in user is staff
            if(user){ 
                const token = await user.getIdToken();
                //Check if invalid input and display input error if so 
                if (newSchool === '') {
                    console.log("EQKAL")
                    document.getElementById("school-input").style.border = '2px solid red';
                }
                //Otherwise, send POST request to server containing new school name 
                else {
                const response = await(fetch('http://localhost:3001/new-school', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ newSchool })
                }));
                //If POST request goes through, alert user of success
                if (response.ok) {
                    console.log('School added successfully');
                //Otherwise, alert user of failure
                } else {
                    console.error('Failed to add new school');
                } 
                //Finally, close popup and refresh page 
                setIsOpen(false);
                refreshPage();
                }
            }
        }   catch (error) {
            console.error('Error adding school: ', error);
        }
        console.log('POST request sent from update button')
        //setIsOpen(false);
        //refreshPage();
    }

    //Return the HTML and elements used to render all schools and populate Back button and Add School button which has functionality to add a new school to School SQL table 
    return (
        <div id="page">
            <div id="_topRectangle">
                <div className="management-header">
                    <div class="management-button-header">
                        <button class="management-header-button" onClick={backButtonHandler}>Back</button>
                    </div>
                    <div class="management-header-text">
                        <h2>School Management Page</h2>
                        <h4>Please select an option for school management.</h4>
                    </div>
                    <div class="management-button-header">
                        <button class="management-header-button" onClick={openPopup}>Add School +</button>
                    </div>
                    
                </div>
                
                {isOpen && (
                    <div className="popup">
                        <div className="popup-content">                           
                                <label>Add a School</label>
                                <br/><br/>
                                <input id="school-input" type="text"  placeholder="Enter the name of new school" value={newSchool} onChange={(e) => setNewSchool(e.target.value)} ></input>
                                <br/><br/>
                                <button onClick={closePopup}>Cancel</button>
                                <button onClick={addNewSchool}>Add</button>
                        </div>
                    </div>
                )}
            </div>

            {error && (
                <div className="popup">
                    <div className="popup-content">
                        <h1>Error rendering schools.</h1>
                        <button onClick={closeError}>Acknowledge</button>
                    </div>
                </div>
            )}

            <div class="content content-margin">
                <div id="school-management-list">
                {schools.map((school) => (
                <SchoolPod key={school.id} value={school.id} ID={school.id} schoolName={school.schoolName} />
                
                 ))}
                </div>
            </div>

            <BottomRectangle/>
        </div>
    )
}


export default SchoolManagementPage;