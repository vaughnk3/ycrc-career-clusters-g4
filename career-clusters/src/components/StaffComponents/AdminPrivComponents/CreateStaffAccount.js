import TopRectangle from "../../page_Components/TopRectangle";
import BottomRectangle from "../../page_Components/BottomRectangle";
import React, { useState } from 'react'
import app from "../../login_components/FirebaseConfig";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { useNavigate } from 'react-router-dom'
import './CreateStaffAccount.css'


const CreateStaffAccount = () => {
    const [email, setUserEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);
    const [message, setMessage] = useState('');
    const auth = getAuth(app);

    const closeError = () => {
        setError(false);
        navigate('/login/adminpage')
    }

    const refreshPage = () => {
        window.location.reload();
    }

    const navigate = useNavigate();

    
    
    
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
        // Create account with inputted pw and email
        try {
        const response = await(fetch('http://localhost:3001/login/adminpage/create-user', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        }))


        if (response.ok) {
            console.log('Sucessfully created user')
            setMessage('Successfully created new user.');
            setError(true);
        }
        
        }   catch (error) {
            console.log("Error");
            setMessage('Failed to create new user.');
            setError(true);
        }
             
        //refreshPage();
        //navigate('/login/adminpage')
    }


    return (
    <div id="page">
        <div id="_topRectangle">
            <p>Enter the email and password for the account to be created.</p>
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
                        <input type="email" value={email} onChange={(e) => setUserEmail(e.target.value)} required />
                    <label><h3>New Password</h3></label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

                        <button class="demographic-button" type="submit">Create Account</button>
                    </div>
                </form>
        </div>
        <BottomRectangle/>
        </div>
    )
}


export default CreateStaffAccount;