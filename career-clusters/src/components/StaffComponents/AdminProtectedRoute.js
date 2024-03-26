import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate, useLocation } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import './AdminProtectedRoute.css'

const AdminProtectedRoute = ({ children }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const adminUID = 'NW0QYGlDcaRCgEk8T8r9n3MgvP22'; //change when passing off to YCRC

    useEffect(() => {
        const auth = getAuth();
        onAuthStateChanged(auth, (currentUser) => {
            if(currentUser) {
                if(currentUser.uid === adminUID) {
                    setUser(currentUser);
                    console.log('Admin user is logged in: ', currentUser);
                } else {
                    setLoading(false);
                    console.log('User is logged in. Redirecting to staffclusters: ', currentUser);
                    navigate('/login/staffclusters');
                    return;
                }
            } else {
                setUser(null);
            }
            // if(currentUser && currentUser.uid === adminUID) {
            //     console.log('Admin user is logged in: ', currentUser)
            //     setUser(currentUser);
            
            // } else {
            //     console.log('Failed admin authentication. Redirecting.')
            //     setUser(null);
            // }
            setLoading(false);
        });
    }, []);

    //Loading animation
    if(loading) {
        return <div id="loading-animation"></div>
    }

    if(!user){
        console.log("user not logged in. byeeee nerd back to the lobby")
        return <Navigate to="/login" state={{ from: location }} replace />;
    } 
    return children;
};

export default AdminProtectedRoute;