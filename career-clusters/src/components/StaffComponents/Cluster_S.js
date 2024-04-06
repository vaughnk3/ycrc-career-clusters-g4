/*
    This component represents a single cluster in the staff cluster view.
    It displays the cluster's name and an image fetched from the database.

    Props:
    - id: ID of the cluster
    - clusterName: Name of the cluster
    - onClick: Function to handle click events on the cluster

    LAST EDITED 04/05/2024 Gavin T. Anderson
*/

// Imports
import React from 'react';
import { useState, useEffect } from 'react';


const Cluster_S = ({ id, clusterName, onClick }) => {
  
  // State to store the image source
  const [imageSrc, setImageSrc] = useState('');

  // Effect hook to fetch image from the database when the component mounts or id changes
  useEffect(() => {
    const fetchImage = async () => {
      try {
        // Fetch image blob from the server
        const response = await fetch(`/n-image/${id}`);
        const blob = await response.blob();

        // Read blob as data URL
        const reader = new FileReader();
        reader.onloadend = function() {
          setImageSrc(reader.result);
        }
        reader.readAsDataURL(blob);
      } catch (error) {
        console.log(error);
      }
    };

    fetchImage(); // Call fetchImage function
  }, [id]); // Depend on id to refetch image when id changes

  return (
    <div onClick={() => onClick(id)} className="cluster">
      {/* Display cluster image */}
      <img src={imageSrc} alt="Cluster Picture" className="cluster-pics"></img>
      {/* Display cluster name */}
      <h2>{clusterName}</h2>
    </div>
  );
}

export default Cluster_S;