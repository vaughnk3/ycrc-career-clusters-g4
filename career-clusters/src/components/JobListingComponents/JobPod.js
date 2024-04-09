import React from "react";
import { useState, useEffect } from 'react';
import './JobPod.css'


const JobPod = ( { jobTitle } ) => {







    return (
        <div className="job-pod">
            <h1>{jobTitle}</h1>
        </div>
    )
}

export default JobPod;