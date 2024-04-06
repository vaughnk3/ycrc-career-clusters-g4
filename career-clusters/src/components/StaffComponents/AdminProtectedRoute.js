/*
    This component represents a protected route for administrators.
    It ensures that only administrators can access certain routes.

    - It checks if the user is logged in and if the user is an admin.
    - If the user is not an admin, it redirects to the staff clusters page.
    - If the user is not logged in, it redirects to the login page.
    - It also displays a loading animation while waiting for authentication.

    LAST EDITED 04/05/2024 Gavin T. Anderson
*/

// Imports
import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate, useLocation } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import './AdminProtectedRoute.css';

const AdminProtectedRoute = ({ children }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null); // State to store user information
    const [loading, setLoading] = useState(true); // State to track loading status
    const location = useLocation(); // Get current location
    const adminUID = 'NW0QYGlDcaRCgEk8T8r9n3MgvP22'; // Admin user ID (replace with actual ID)

    useEffect(() => {
        const auth = getAuth(); // Get authentication instance
        onAuthStateChanged(auth, (currentUser) => { // Listen for authentication state changes
            if (currentUser) {
                if (currentUser.uid === adminUID) { // Check if user is admin
                    setUser(currentUser); // Set user state
                    console.log('Admin user is logged in: ', currentUser);
                } else {
                    setLoading(false); // Set loading to false
                    console.log('User is logged in. Redirecting to staffclusters: ', currentUser);
                    navigate('/login/staffclusters'); // Redirect to staff clusters page
                    return;
                }
            } else {
                setUser(null); // User is not logged in
            }
            setLoading(false); // Set loading to false
        });
    }, []); // Empty dependency array ensures useEffect runs only once

    // Display loading animation while waiting for authentication
    if (loading) {
        return <div id="loading-animation"></div>;
    }

    // If user is not logged in, redirect to login page
    if (!user) {
        console.log("user not logged in. Redirecting to login page");
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children; // Render children if user is logged in as admin
};

export default AdminProtectedRoute;