import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import './ProtectedRoutes.css'

const ProtectedRoute = ({ children }) => {
    const [ user, setUser ] = useState(null);
    const [loading, setLoading] = useState(true);
    const location = useLocation();

    useEffect(() => {
        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
            if(user) {
                console.log('User is logged in: ', user)
                setUser(user);
            } else {
                setUser(null);
            }
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

export default ProtectedRoute;