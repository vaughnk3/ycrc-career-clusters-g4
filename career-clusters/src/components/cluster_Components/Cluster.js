import React from 'react';
import { useState, useEffect } from 'react';
import './Cluster.css';


/*
Cluster.js contains the javascript for putting together an individual cluster. 
It is fed an ID and a name, grabs the corresponding image for that ID, and then 
puts together an indiviudal cluster based on that information. 

LAST EDITED -- 03 / 01 / 2024 --- Ross Friend
*/

const Cluster = ( {id, clusterName, onClick} ) => {

    //This will get the image from the database as a blob, 
    //Then be read as a data URL to put into the src{} tag.  
    const [imageSrc, setImageSrc] = useState('');
    useEffect(() => {
      // Try to get the image for a particular ID
      const fetchImage = async () => {
        const response = await (fetch(`/n-image/${id}`));
        const blob = await response.blob();
        const reader = new FileReader();
        reader.onloadend = function() {
          //Set our image in the useState var
          setImageSrc(reader.result);
        }
        reader.readAsDataURL(blob);
      };
      // If the fetch succeeds, our image will be set, othwerise console log the error.
      try {fetchImage();}
      catch (error) {
        console.log(error);
      }
    }, [id]);

    // Create a dynamic alt tag for disability usability.  Append "cluster picture" to the name 
    // Example:    Agriculture cluster picture. 
    const altTag = clusterName + " Cluster picture";

    // Return an individual cluster with the proper image and name, with styling from Cluster.css
  return (
    <div onClick={() => onClick(id)} class="cluster">
        <img src={imageSrc} alt={altTag} className="cluster-pics"></img>
        <h2> {clusterName}
        </h2>
    </div>
  );
}

//Export the cluster to be used in ClusterPage.js
export default Cluster;

