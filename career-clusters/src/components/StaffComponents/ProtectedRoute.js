/*
    This component defines a protected route, which ensures that the user is authenticated
    before rendering the children components. If the user is not authenticated, it redirects
    to the login page.

    The route's authentication status is determined by the Firebase authentication state.

    Component structure:
    - It imports necessary dependencies from React, React Router, Firebase authentication,
      and the CSS file associated with this component.
    - The component function takes the children components as props.
    - It uses useState to manage the user's authentication state and loading status.
    - The useEffect hook is used to subscribe to the Firebase authentication state changes.
    - If the user is authenticated, it sets the user state and renders the children components.
    - If the user is not authenticated, it redirects to the login page using the Navigate
      component from React Router.
    - While loading, it displays a loading animation.

    LAST EDITED 04/05/2024 Gavin T. Anderson
*/

// Imports
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import './ProtectedRoutes.css'

const ProtectedRoute = ({ children }) => {
    const [ user, setUser ] = useState(null); // State to manage the user's authentication status
    const [loading, setLoading] = useState(true); // State to manage the loading status
    const location = useLocation(); // Get the current location

    // Effect hook to subscribe to Firebase authentication state changes
    useEffect(() => {
        const auth = getAuth(); // Get the Firebase auth instance
        onAuthStateChanged(auth, (user) => { // Subscribe to authentication state changes
            if(user) { // If the user is authenticated
                console.log('User is logged in: ', user);
                setUser(user); // Set the user state
            } else { // If the user is not authenticated
                setUser(null); // Reset the user state
            }
            setLoading(false); // Set loading to false when authentication state changes
        });
    }, []); // Empty dependency array to ensure the effect runs only once

    // If loading, display a loading animation
    if(loading) {
        return <div id="loading-animation"></div>;
    }

    // If the user is not authenticated, redirect to the login page
    if(!user){
        console.log("User not logged in. Redirecting to the login page.");
        return <Navigate to="/login" state={{ from: location }} replace />;
    }
    // If the user is authenticated, render the children components
    return children;
};

export default ProtectedRoute;