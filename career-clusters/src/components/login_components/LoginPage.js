import React, { useState  } from "react";
import TopLeftLogo from '../page_Components/TopLeftLogo';
import BottomRectangle from '../page_Components/BottomRectangle';
import './LoginPage.css'
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import {getAuth, sendPasswordResetEmail, signInWithEmailAndPassword} from "firebase/auth";
import app from "./FirebaseConfig"; 



// Initialize auth
const auth = getAuth(app);


const LoginPage = () => {
    const[username, setUsername] = useState('');
    const[password, setPassword] = useState('');
    const[email, setEmail] = useState('')
    const[failLogin, setFailLogin] = useState(false);



    //Define state methods for popup
    const [isOpen, setIsOpen] = useState(false);

    const openPopup = () => { setIsOpen(true) }
    const closePopup = () => { setIsOpen(false) }
    const closeLogin = () => { setFailLogin(false) }

    const navigate = useNavigate();
    const adminUID = 'NW0QYGlDcaRCgEk8T8r9n3MgvP22'
    
    //Sign in handler with firebase
    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
          const userCredential = await signInWithEmailAndPassword(auth, username, password);
          const user = userCredential.user;
          console.log('User logged in: ', user);
          if(user.uid === adminUID) {
            navigate('/login/adminpage')
          } else {
            navigate('/login/staffclusters')
          }
        } catch (error) {
          console.error('Login error:', error.message);
          setFailLogin(true);
        }
    };


    //Handler for forgot password click with firebase
    const handleForgotPassSubmit = async (event) => {
      event.preventDefault();
       try {
        await sendPasswordResetEmail(auth, email);
       }
       catch (error) {
        console.error("Error sending password reset email: ", error);
       }
       setIsOpen(false);
    };

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


export default LoginPage;