import './ClusterManagementPage.css';
import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import BottomRectangle from '../../page_Components/BottomRectangle';
import ManagementSubCluster from './ManagementSubCluster';
import { getAuth } from "firebase/auth";
import app from "../../login_components/FirebaseConfig"

/* 
This page contains the primary JSX code that comprises the SubCluster Managage page
Includes the header buttons, fetching selected subset of subclusters, and the add SubCluster functionality. 
*/

const SubClusterManagementPage = () => {
    // Set all useState hooks, including the navigate hook.
    const navigate = useNavigate();
    // Popup Tracker
    const [isOpen, setIsOpen] = useState(false);
    // New Subcluster Description
    const [newSCDescrip, setNewDescrip] = useState(' ');
    // New Subcluster Name
    const [newSCName, setNewName] = useState(' ');
    // New Subcluster Salary
    const [newSCSalary, setNewSalary] = useState(0);
    // New Subcluster Education level
    const [newSCEdLevel, setNewEdLevel] = useState(' ');
    // New subcluster Growth Rate
    const [newSCGrowthRate, setNewGrowthRate] = useState(' ');
    // Selcted cluster ID from Parent Cluster Dropdown
    const [clusterID, setClusterID] = useState('');
    // New Subcluster Image
    const [newImage, setNewImage] = useState(null);
    // Loading tracker
    const [loading, setLoading] = useState(true);
    // Holds all fetched Subclusters for display
    const [subClusters2, setSubClusters2] = useState([]);
    // Success or fail popup state tracker
    const [addState, setAddState] = useState(false);
    // Holds result message for status of add
    const [message, setMessage] = useState('');
    // Set selected cluster ID from management dropdown
    const [clusterId, setClusterId] = useState('0');
    // State tracker for selecting Subclusters
    const [clusterPopup, setClusterPopup] = useState(false);
    
    // Initialize authentication 
    const auth = getAuth(app);

    /* Define popup manipulations */

    // Closes status popup and refreshes page
    const closeAddState = () => { setAddState(false); refreshPage() }
    // Opens add subcluster popup
    const openPopup = () => { setIsOpen(true); }
    // Closes add subcluster popup
    const closePopup = () => { setIsOpen(false); }
    // Opens the cluster popup
    const openCluster = () => { setClusterPopup(true); }
    // Closes the cluster popup
    const closeCluster = () => { setClusterPopup(false); }

    // Navigate to staff landing page if back button is clicked.
    const handleBackButton = () => {
        navigate('/login/staffclusters/')
    }

    // Once the post request occurs, refresh the page so we can see the changes. 
    const refreshPage = () => {
        window.location.reload();
    }


   // Fetch the selected Subclusters to be mapped to display.
    useEffect( () => {
        const fetchIDSubclusters = async () => {
            try {
                // Fetch
                const response = await fetch(`http://localhost:3001/subclustermanagementpage/${clusterId}`);

                // Failure - close the popup, set error message, and display error popup. 
                if (!response.ok){
                    setLoading(false);
                    setMessage('Failed to load SubClusters.')
                    setAddState(true);
                    throw new Error('Error fetching subclusters');
                }
                
                // Success - set the data
                const data = await response.json();
                setSubClusters2(data);

                // Failure - close the popup, set error message, and display error popup. 
            }   catch (error){
                console.error('Error: ', error);
                setLoading(false);
                setMessage('Failed to load SubClusters.')
                setAddState(true);
            }
        }
        // Call the function
        fetchIDSubclusters();
    }, [clusterId]);

    

    /********************************************* */
    //FETCH CLUSTERS
    const [clusters, setClusters] = useState([]);

    // Fetch the Clusters so their names can be mapped in the Parent Cluster Dropdown.  
    useEffect(() => {
        const fetchClusters = async () => {
            try { 
                // Fetch ---- /subclustermanagementpage/fetch-clusters
                const response = await (fetch('http://localhost:3001/uniq-clust-dropdowns'));

                // Failure 
                if(!response.ok) {
                    throw new Error('Error fetching clusters');
                }
                console.log("after fetch")
                // Success - set data received
                const data = await response.json();
                setClusters(data);
                console.log("fetch----", data);
                
            // Failure 
            } catch (error) {
                console.error('Error: ', error);
            }
        }
        // Call the function
        fetchClusters();
    }, []);
    /********************************************* */


    /********************************************* */
    //Add new subcluster code

    const addSubCluster = async () => {
        // Placeholder values. 
        let subclusterID = 0;
        var canSend = true;
        //Checks if no iamge has been entered AND if no selection of parent cluster has been made, then set false flag and border outlining
        if(!newImage) {
            document.getElementById("imgWrapper").style.border = '2px solid red';
            canSend = false;
        }
        if(clusterID === "") {
            document.getElementById("select-cluster").style.outline = '2px solid red';
            canSend = false;
        }

        // Attempt the add subcluster functionality
        try {
            if(canSend === true) {
                // Create a form and append all the data for the first query
                const formData = new FormData();
                formData.append('image', newImage);
                formData.append('subclusterName', newSCName)
                formData.append('clusterID', clusterID)

                // Grab the authenticated user 
                const user = auth.currentUser;

                // If a user is logged in - 
                if(user) {
                    // Grab the user token
                    const token = await user.getIdToken();

                    // Make post request 
                    const response = await(fetch('http://localhost:3001/subclustermanagementpage/add-subcluster', {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${token}`,                 //pass authenticated user token to backend
                        },
                        body: formData
                    }));

                    // If request is successful, grab the ID of the newly created SubCluster
                    if (response.ok) {
                        const data = await response.json();
                        subclusterID = data.subclusterID;
                        //console.log('SubCluster added successfully with ID: ', subclusterID);
                        
                    } 
                    // Failure
                    else {
                        console.error('Failed to add subcluster');
                    } 
                }
            // Failure of first try block
            }
        }   catch (error) {
            console.error('Error adding subcluster: ', error);
        }

        // Attempt the creation of the "Field" table row attached to the new Subcluster ID
        try {
            if(canSend === true) {
            // Grab the logged in user
            const user = auth.currentUser;

            // If user is logged in -
            if(user) {
                // Grab the user token
                const token = await user.getIdToken();
                
                // Attempt post request
                const response = await(fetch('http://localhost:3001/subclustermanagementpage/add-subcluster-field', {
                    method: 'POST',
                    // credentials: "include",    verification for back-end
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type' : 'application/json'
                    },
                    body: JSON.stringify({subclusterID, newSCName, newSCDescrip, newSCSalary, newSCEdLevel, newSCGrowthRate})
                }));

                // If successful, close the popup and put the new popup up with the success status message. 
                if(response.ok) {
                    console.log('Field data added successfully');
                    setIsOpen(false);
                    setMessage('SubCluster successfully created.');
                    setAddState(true);
                } 
                // If a failure occurs - close the popup and put the new popup up with the failure status message. 
                else {
                    console.error('Failed to add field data');
                    setIsOpen(false);
                    setMessage('Failed to create SubCluster.');
                    setAddState(true);
                }
            }
        }
        // If a failure occurs - close the popup and put the new popup up with the failure status message. 
        } catch(error) {
            console.error('Error adding field: ', error);
            setIsOpen(false);
            setMessage('Failed to create SubCluster.');
            setAddState(true);
        }
    }

    /********************************************* */
    // If a new file is selected, set the file in the useState constant.
    const handleFileInputChange = (e) => 
    {
        setNewImage(e.target.files[0]);
    }

    
    //Sets a 5 second limit for the which the loading animation while display
    useEffect(() => {
        const timer = setTimeout(() => {
          setLoading(false); // This will hide the loading animation after the timeout
        }, 5000); // Set the timeout duration here (5000ms = 5 seconds)
    
        return () => clearTimeout(timer); // Cleanup the timeout on component unmount
      }, []);
      

    //Loading animation
    if (loading) {
        return <div id="loading-animation"></div>
      }

// Return the HTML for the component
return (
    <div id="page">
        <div id="_topRectangle">
            <button id="back_button" onClick={handleBackButton}>Back</button>

            
            {clusterPopup && (
                <div className="popup">
                    <div className="popup-content">
                        <h1>Select the parent Cluster of the SubCluster you wish to manage.</h1>

                        <select id="subm-select-cluster" value={clusterId} onChange={(e) => setClusterId(e.target.value)} >
                            <option value="" disabled selected hidden className="hidden">Select Parent Cluster</option>
                            {clusters.map((cluster) => (
                                <option key={cluster.id} value={cluster.id} >
                                    {cluster.clusterName}
                                </option>
                            ))}
                        </select>
                        <button onClick={closeCluster}>Back</button>
                    </div>
                </div>
            )}



            <button id="add_cluster" onClick={openPopup}>Add SubCluster +</button>
            
            {isOpen && (
                <div className="popup">
                    <div className="addsc-container">  
                        <div className="newsc-left">
                        
                        <label className="label-addsc" for="subclusterName">Name</label>
                        <input
                            type="text"
                            id="subclusterName"
                            name="subclusterName"
                            placeholder="Enter new Name"
                            value={newSCName.trim().length ? newSCName : ''}
                            onChange={(e) => setNewName(e.target.value || ' ')}
                            />
                        <br/>
                        <label className="label-addsc" for="subclusterSalary">Salary</label>
                        <input type="number" id="subclusterSalary" name="subclusterSalary"  placeholder="Enter new Salary here" value={newSCSalary} onChange={(e) => setNewSalary(e.target.value)}></input>

                        <br/>
                        <label className="label-addsc" for="subclusterEducation">Education Level</label>
                        <input
                            type="text"
                            id="subclusterEducation"
                            name="subclusterEducation"
                            placeholder="Enter new education level"
                            value={newSCEdLevel.trim().length ? newSCEdLevel : ''}
                            onChange={(e) => setNewEdLevel(e.target.value || ' ')}
                        />

                        <label className="label-addsc">Parent Cluster</label>
                        <select id="select-cluster" value={clusterID} onChange={(e) => setClusterID(e.target.value)} >
                            <option value="" disabled selected hidden className="hidden">Select Parent Cluster</option>
                            {clusters.map((cluster) => (
                                <option key={cluster.id} value={cluster.id} >
                                    {cluster.clusterName}
                                </option>
                            ))}
                        </select>

                        </div>
                        <div className="newsc-right">
                        <label className="label-addsc" for="subclusterDescrip">Description</label>
                        <textarea
                            id="subclusterDescrip"
                            maxLength="200"
                            name="subclusterDescrip"
                            placeholder="Enter new description."
                            value={newSCDescrip.trim().length ? newSCDescrip : ''}
                            onChange={(e) => setNewDescrip(e.target.value || ' ')}
                        />
                        
                        <label className="label-addsc" for="rate">Growth Rate</label>
                        <select id="growth-rate" name="rate" value={newSCGrowthRate} onChange={(e) => setNewGrowthRate(e.target.value)} >
                            <option>Select Growth Rate</option>
                            <option value="High">High</option>
                            <option value="Medium">Medium</option>
                            <option value="Low">Low</option>
                        </select>

                        <label className="label-addsc" for="img">Image</label>
                        <div id="imgWrapper">
                            <input type="file" id="img" name="img" accept="image/*" onChange={handleFileInputChange}></input>
                        </div>
                        </div>
                        <br/>
                        <div className="newsc-buttonrow">
                        <button onClick={closePopup} className="cancelButton">Cancel</button>
                        <button id="submitName" onClick={addSubCluster}>Submit</button>
                        </div>
                    </div>
                </div>
             )}  


             {addState && (
                <div className="popup">
                    <div className="popup-content">
                        <h1>{message}</h1>
                        <button onClick={closeAddState}>Acknowledge and Refresh</button>
                    </div>
                </div>
             )}


            <h2>SubCluster Management Page</h2>
            <h4>Please select an option for subcluster management</h4>
        </div>
            
        <div className="content content-margin">
            <div id="subm-content">
            <button id="subm-cluster-button" onClick={openCluster}>Select Parent Cluster</button>
            <ul className="scmgmt_list">
                {subClusters2.map((subcluster) => (
                    <li>
                        <ManagementSubCluster key={subcluster.id} ID={subcluster.id} subclusterName={subcluster.subclusterName} />
                    </li>
                ))}
            </ul>
            </div>
        </div>
        
        <BottomRectangle/>
    </div>
)
}

// Export the completed component
export default SubClusterManagementPage;

/*
*/