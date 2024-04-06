/*
  React component for displaying a staff subcluster.

  Features:
  - Fetches and displays the image of the subcluster from the server.
  - Handles click event to navigate to the detailed information page of the subcluster.
  
  Props:
  - ID: ID of the subcluster.
  - subID: ID of the parent cluster.
  - subclusterName: Name of the subcluster.
  - onClick: Function to handle click event.

  Dependencies:
  - React, Link: Imported from 'react' and 'react-router-dom' respectively.
  - useState, useEffect: Imported from 'react'.
  - useNavigate: Imported from 'react-router-dom'.

  LAST EDITED 04/05/2024 by Gavin T. Anderson
*/
import React from "react";
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

const SubCluster_S = ( {ID, subID, subclusterName, onClick} ) => {

  const navigate = useNavigate();
  
  //This will get the image from the database as a blob, 
  //Then be read as a data URL to put into the src{} tag.  
  const [imageSrc, setImageSrc] = useState('');
  useEffect(() => {
    const fetchImage = async () => {
      console.log("TEST SUB ID: ", ID)
      const response = await (fetch(`http://localhost:3001/subclust-img-pull/${ID}`));
      const blob = await response.blob();
      const reader = new FileReader();
      reader.onloadend = function() {
        setImageSrc(reader.result);
      }
      reader.readAsDataURL(blob);
    };

    try {fetchImage();}
    catch (error) {
      console.log(error);
    }
  }, [ID]);

  // Handle navigation to the detailed subcluster information page
  const handleNav = () => {
    navigate(`/login/staffclusters/staffsubclusters/staffsubclusterinfo/${ID}`);
  }

  return (
    <div onClick={ handleNav } className="subcluster"> 
      <img src={ imageSrc } alt="SubCluster Picture" className="subcluster-pics"></img>
      <h2>{subclusterName}</h2>
    </div>
  );
};  

export default SubCluster_S;
