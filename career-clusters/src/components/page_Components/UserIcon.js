import React from "react";
import './UserIcon.css';

const UserIcon = () => {
    return (
    <div>
        <a href="/login"><img src={require('./UserIcon.png')} alt="User Icon" className="top-right-image"></img></a>
    </div>
    );
}

export default UserIcon;