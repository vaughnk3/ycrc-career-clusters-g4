    import React from "react";
    import './SubCluster.css'
    import { Link } from 'react-router-dom';
    import { useState, useEffect } from 'react';
    import { useNavigate } from "react-router-dom";

   
    const SubCluster = ( {ID, subclusterName, onClick} ) => {

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



        const handleNav = () => {
            navigate(`/cluster/subcluster/subclusterinfo/${ID}`)


            const updateSubClusterClickCount = async () => {
                try {
                    console.log("SUB   IDDDDDD, ", ID)
                    const response = await (fetch('http://localhost:3001/updates-subclust-clickCnt', {
                        method: 'POST', 
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify( { subclusterID: ID })
                    }));
                    if (response.ok) {
                        console.log('SubCluster click count updated successfully');
                    } else {
                        console.error('Failed to update subcluster clickount')
                    }
                } catch (error) {
                    console.error('Error updating subcluster clickcount: ', error)
                }
            }
    
            // Call the update click count function
            updateSubClusterClickCount();
        }

        return (
            
            <div onClick={handleNav} class="subcluster"> 
            <img src={ imageSrc } alt="SubCluster Picture" className="subcluster-pics"></img>
            <h2>{subclusterName}</h2>
            </div>
            
        );
    };  

    export default SubCluster

    /*
    <Link to={`/cluster/subcluster/subclusterinfo/${ID}`}>
    </Link>
    */

    //() => onClick(ID)