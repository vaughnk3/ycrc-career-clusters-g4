import TopRectangle from "../../page_Components/TopRectangle";
import BottomRectangle from "../../page_Components/BottomRectangle";
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import app from "../../login_components/FirebaseConfig";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import './CreateStaffAccount.css'


/*
This file contains the Javascript code and post requests used by an admin to create a staff account.
The username and password, which the admin enters, is sent to the server which then uses that data to
create an account with Firebase. 
Components:
BottomRectangle

KJ Vaughn
*/

//React component for staff account creation page, used by admins
const CreateStaffAccount = () => {
    // State variables to keep track of entered staff account information
    const [email, setUserEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);
    const [message, setMessage] = useState('');
    //Utilize Firebase config
    const auth = getAuth(app);

    const closeError = () => {
        setError(false);
        navigate('/login/adminpage')
    }

    //Function used to refresh page 
    const refreshPage = () => {
        window.location.reload();
    }

    const navigate = useNavigate();

    
    
    //Sign up function sends in admin-entered state of email and password via POST request to server
    const handleSignUp = async (e) => {
        // OLD SIGN UP METHOD
        /*
        let userCredential = "";
        e.preventDefault();
        try {
            userCredential = await createUserWithEmailAndPassword(auth, email, password);
            console.log("Account created successfully!", userCredential);
        } catch (error) {
            console.error("Error creating account:", error.message);
        }
        */
        e.preventDefault();
        // Create staff account with admin-inputted pw and email
        try {
        const response = await(fetch('http://localhost:3001/login/adminpage/create-user', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        }))

        //If response goes through, alert admin of success
        if (response.ok) {
            console.log('Sucessfully created user')
            setMessage('Successfully created new user.');
            setError(true);
        }
        
        //Otherwise, catch and tell admin of error that occurred
        }   catch (error) {
            console.log("Error");
            setMessage('Failed to create new user.');
            setError(true);
        }
             
        //refreshPage();
        //navigate('/login/adminpage')
    }

    const handleBackButton = () => {
      navigate('/login/adminpage/')
    }

    //Return the HTML & elements used to describe and display input form to create staff account
    return (    
    <div id="page">
        <div id="_topRectangle">
            <div class="management-header">
                <div class="management-button-header">
                    <button class="management-header-button single" onClick={handleBackButton}>Back</button>
                </div>
                <div class="management-header-text">
                  <h2>Enter the email and password for the account to be created.</h2>
                </div>
                <div class="management-button-header"></div>
            </div>
        </div>

        {error && (
            <div className="popup">
                <div className="popup-content">
                    <h1>{message}</h1>
                    <button onClick={closeError}>Acknowledge</button>
                </div>
            </div>
        )}

        <div class="content content-margin">
            <form id="staff-account-form" onSubmit={handleSignUp}>
                <div id="staff-account-form-content">
                    <label><h3>New Email</h3></label>
                        <input type="email" placeholder="Enter the new account email." value={email} onChange={(e) => setUserEmail(e.target.value)} required />
                    <label><h3>New Password</h3></label>
                        <input type="password" placeholder="Enter a new password for the new account." minLength="6" value={password} onChange={(e) => setPassword(e.target.value)} required />

                        <button class="demographic-button" type="submit">Create Account</button>
                    </div>
                </form>
        </div>
        <BottomRectangle/>
        </div>
    )
}


export default CreateStaffAccount;