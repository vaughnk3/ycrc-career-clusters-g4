import React from "react";
import './UserIcon.css';

/*
This file contains the user icon component which is used to navigate
to the login page which is evident throughout most pages

KJ Vaughn
*/
const UserIcon = () => {
    return (
    <div>
        <a href="/login"><img src={require('./UserIcon.png')} alt="User Icon" className="top-right-image"></img></a>
    </div>
    );
}

export default UserIcon;