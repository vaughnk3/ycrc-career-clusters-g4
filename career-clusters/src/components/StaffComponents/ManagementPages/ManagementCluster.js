import './ManagementCluster.css';
import React, { useState, useEffect } from "react";
import EditNameButton from './EditNameButton';
import ReplaceImageButton from './ReplaceImageButton';
import DeleteClusterButton from './DeleteClusterButton';

/*
This file contains the Javascript code and GET requests utilized by staff accounts to conditionally render 
each cluster, along with their managerial buttons to edit name, replace image, or delete cluster
Components:
EditNameButton
ReplaceImageButton
DeleteClusterButton

KJ Vaughn
*/

//React component which recieves cluster ID and name used for mapping in staff management page
const ManagementCluster = ({ ID, clusterName }) => {

    //State variable to update image
    const [imageSrc, setImageSrc] = useState('');
    useEffect(() => {
      const fetchImage = async () => {
        const response = await (fetch(`http://localhost:3001/n-image/${ID}`));
        const blob = await response.blob();
        const reader = new FileReader();
        //Update image
        reader.onloadend = function() {
          setImageSrc(reader.result);
        }
        reader.readAsDataURL(blob);
      };
      //Attempt to fetch new image
      try {fetchImage();}
      //Otherwise, log error caused by failure
      catch (error) {
        console.log(error);
      }
    }, [ID]);

    //Return the HTML and elements for sructure used for mapping each particular cluster, containing
    //the button to edit name, replace image, or deletion for that particular cluster 
    return (
        <div className='cluster_m'>
            <img src={imageSrc} className="cluster_m_pics" alt="Cluster_Pic" />
            <h2>{clusterName}</h2>
            <div className="mgmt_list_right"> 
            <EditNameButton ID={ID} clusterName={clusterName}/>
            <ReplaceImageButton ID={ID}/>
            <DeleteClusterButton ID={ID}/>
            </div>
        </div>
    )
}

export default ManagementCluster;


