import React, { useState  } from "react";
import TopLeftLogo from '../page_Components/TopLeftLogo';
import BottomRectangle from '../page_Components/BottomRectangle';
import './LoginPage.css'
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import {getAuth, sendPasswordResetEmail, signInWithEmailAndPassword} from "firebase/auth";
import app from "./FirebaseConfig"; 



// Initialize auth
const auth = getAuth(app);

// Create our component to be used in the app
const LoginPage = () => {
    // Define all of the state variables necessary for this page
    const[username, setUsername] = useState('');
    const[password, setPassword] = useState('');
    const[email, setEmail] = useState('')
    const[failLogin, setFailLogin] = useState(false);
    const[message, setMessage] = useState('');
    const[forgot, setForgot] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    // Define the popup state handlers
    const openPopup = () => { setIsOpen(true) }
    const closePopup = () => { setIsOpen(false) }
    const closeLogin = () => { setFailLogin(false) }
    const closeForgot = () => { setForgot(false); }

    // Define our navigate hook
    const navigate = useNavigate();

    // Use the constant Admin account UID to conditionally route a newly logged in user to the proper spot.  
    const adminUID = 'NW0QYGlDcaRCgEk8T8r9n3MgvP22'
    
    //Sign in handler with firebase
    const handleSubmit = async (event) => {
        event.preventDefault();

        // Attempt a login
        try {
          // Attempt to sign in with Firebase auth, username, and password
          const userCredential = await signInWithEmailAndPassword(auth, username, password);

          // User is defined as whomever just logged in
          const user = userCredential.user;

          // If the admin is logged in, navigate to admin landing page.
          if(user.uid === adminUID) {
            navigate('/login/adminpage')
          } 
          // If any other user is logged in, navigate to staff cluster view. 
          else {
            navigate('/login/staffclusters')
          }
        } 
        //If login failed, catch error and bring up the error popup/
        catch (error) {
          console.error('Login error:', error.message);
          setFailLogin(true);
        }
    };


    //Handler for forgot password click with firebase
    const handleForgotPassSubmit = async (event) => {
      event.preventDefault();
      // Attempt sending forgot password email
       try {
        const response = await sendPasswordResetEmail(auth, email);
        // Give the correct popup if it is successful
        setIsOpen(false);
        setMessage('Email has been sent.  Please check your inbox.');
        setForgot(true);
       }
       catch (error) {
        // Throw the error popup if sending forgot password email fails
        console.error("Error sending password reset email: ", error);
        setIsOpen(false);
        setMessage('Email has been sent.  Please check your inbox.');
        setForgot(true);
       }
    };

    // Return the HTML for the login page
    return (
        <div id="page">
          <div id="topbar">
            <TopLeftLogo />
          </div>

          { failLogin && (
            <div className="popup">
              <div className="popup-content">
                <h1>Error logging in.</h1>
                <p>Invalid username or password. Please try again.</p>
                <button onClick={closeLogin}>Close</button>
              </div>
            </div>
          )}

          {forgot && (
            <div className="popup">
              <div className="popup-content">
                <h1>{message}</h1>
                <button onClick={closeForgot}>Close</button>
              </div>
          </div>
          )}

          <div class="content">
            <div id="login-form">
              <form onSubmit={handleSubmit}>
                <label htmlFor="usernameField"><h3>Username</h3></label>
                <input
                  type="text"
                  className="field"
                  placeholder='Input username here'
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
                <label htmlFor="passwordField"><h3>Password</h3></label>
                <input
                  type="password"
                  className="field"
                  placeholder='Input password here'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength="6"
                  required
                />
                <p onClick={openPopup} >Forgot Password?</p>
                {isOpen && (
                  <div className="pass-popup"> 
                    <div className="pass-popup-content">
                        <label>
                          <h3 className="title">Email</h3>
                          <input type="email" placeholder="Enter the email associated with your account." value={email} onChange={(e) => setEmail(e.target.value)} required></input>
                        </label>
                        <button class="demographic-button" type="submit" onClick={handleForgotPassSubmit}>Send Password Reset Email</button>
                        <button class="demographic-button" onClick={closePopup}>Cancel</button>
                    
                    </div>
                  </div>
                )}
                <button type="submit" class="demographic-button">Login</button>
              </form>
            </div>
          </div>
    
          <BottomRectangle />
        </div>
      );


};

// Export the completed component
export default LoginPage;