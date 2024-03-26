import './ClusterManagementPage.css';
import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import BottomRectangle from '../../page_Components/BottomRectangle';
import ManagementSubCluster from './ManagementSubCluster';
import { getAuth } from "firebase/auth";
import app from "../../login_components/FirebaseConfig"



const SubClusterManagementPage = () => {
    /********************************************* */
    //FETCH SUBCLUSTERS CODE
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const openPopup = () => { setIsOpen(true); }
    const closePopup = () => { setIsOpen(false); }
    const [newSCDescrip, setNewDescrip] = useState(' ');
    const [newSCName, setNewName] = useState(' ');
    const [newSCSalary, setNewSalary] = useState(' ');
    const [newSCEdLevel, setNewEdLevel] = useState(' ');
    const [newSCGrowthRate, setNewGrowthRate] = useState(' ');
    const [clusterID, setClusterID] = useState('');
    const [newImage, setNewImage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [subClusters2, setSubClusters2] = useState([]);
    const [addState, setAddState] = useState(false);
    const [message, setMessage] = useState('');

    const auth = getAuth(app);

    const closeAddState = () => {
        setAddState(false)
        refreshPage()
    }

    

    const handleBackButton = () => {
        navigate('/login/staffclusters/')
    }

    // Once the post request occurs, refresh the page so we can see the changes. 
    const refreshPage = () => {
        window.location.reload();
    }


    useEffect(() => {
        const fetchSubClusters2 = async () => {
            try {
                const response = await (fetch('http://localhost:3001/subclustermanagementpage'));
                if (!response.ok) {
                    setLoading(false);
                    setMessage('Failed to load SubClusters.')
                    setAddState(true);
                    throw new Error('Error fetching subclusters');
                }

                const data2 = await response.json();
                setSubClusters2(data2);
                console.log(data2)
            } catch (error) {
                console.error('Error: ', error);
                setLoading(false);
                setMessage('Failed to load SubClusters.')
                setAddState(true);
                
            }
            
        }
        fetchSubClusters2();
    }, []);
    /********************************************* */

    /********************************************* */
    //FETCH CLUSTERS
    const [clusters, setClusters] = useState([]);

    useEffect(() => {
        const fetchClusters = async () => {
            try { 
                const response = await (fetch('http://localhost:3001/subclustermanagementpage/fetch-clusters'));
                if(!response.ok) {
                    throw new Error('Error fetching clusters');
                }
                const data = await response.json();
                console.log(data)

                setClusters(data);
                
            } catch (error) {
                console.error('Error: ', error);
            }
        }
        fetchClusters();
    }, []);
    /********************************************* */


    /********************************************* */
    //Add new subcluster code




            const addSubCluster = async () => {
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
                try {
                    if(canSend === true) {
                        const formData = new FormData();
                        formData.append('image', newImage);
                        formData.append('subclusterName', newSCName)
                        formData.append('clusterID', clusterID)
                        const user = auth.currentUser;
                        if(user) {
                            const token = await user.getIdToken();
                            const response = await(fetch('http://localhost:3001/subclustermanagementpage/add-subcluster', {
                                method: 'POST',
                                headers: {
                                    'Authorization': `Bearer ${token}`,                 //pass authenticated user token to backend
                                },
                                body: formData
                            }));
        
                            if (response.ok) {
                                const data = await response.json();
                                subclusterID = data.subclusterID;
                                console.log('SubCluster added successfully with ID: ', subclusterID);
                                
                            } else {
                                console.error('Failed to add subcluster');
                            } 
                        }
                    console.log('POST request sent from add subcluster button')
                    console.log('SubCluster added successfully with ID between: ', subclusterID);
                    }
                }   catch (error) {
                    console.error('Error adding subcluster: ', error);
                }
                    try {
                        if(canSend === true) {
                        const user = auth.currentUser;
                        if(user) {
                            const token = await user.getIdToken();
                            const response = await(fetch('http://localhost:3001/subclustermanagementpage/add-subcluster-field', {
                                method: 'POST',
                                // credentials: "include",    verification for back-end
                                headers: {
                                    'Authorization': `Bearer ${token}`,
                                    'Content-Type' : 'application/json'
                                },
                                body: JSON.stringify({subclusterID, newSCName, newSCDescrip, newSCSalary, newSCEdLevel, newSCGrowthRate})
                            }));
                            console.log(subclusterID, " INSIDE SECOND REQUEST");
                            if(response.ok) {
                                console.log('Field data added successfully');
                                setIsOpen(false);
                                setMessage('SubCluster successfully created.');
                                setAddState(true);
                            } else {
                                console.error('Failed to add field data');
                                setIsOpen(false);
                                setMessage('Failed to create SubCluster.');
                                setAddState(true);
                            }
                        }
                    }
                    } catch(error) {
                        console.error('Error adding field: ', error);
                        setIsOpen(false);
                        setMessage('Failed to create SubCluster.');
                        setAddState(true);
                    }
                    console.log('POST request sent from add subcluster button for field information')
                    // setIsOpen(false);
                    //refreshPage();
            }

    /********************************************* */

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


    return (
        <div id="page">
            <div id="_topRectangle">
                <button id="back_button" onClick={handleBackButton}>Back</button>
                <button id="add_cluster" onClick={openPopup}>Add SubCluster +</button>
                {isOpen && (
                    <div className="popup">
                        <div className="addsc-container">  
                            <div className="newsc-left">
                            
                            <label class="label-addsc" for="subclusterName">Name</label>
                            <input type="text" id='subclusterName' name="subclusterName" placeholder='Enter new Name'  value={newSCName} onChange={(e) => setNewName(e.target.value)}></input>
                            <br/>
                            <label class="label-addsc" for="subclusterSalary">Salary</label>
                            <input type="text" id="subclusterSalary" name="subclusterSalary" placeholder="Enter new Salary" value={newSCSalary} onChange={(e) => setNewSalary(e.target.value)}></input>
                            <br/>
                            <label class="label-addsc" for="subclusterEducation">Education Level</label>
                            <input type="text" id="subclusterEducation" name="subclusterEducation" placeholder="Enter new ed level" value={newSCEdLevel} onChange={(e) => setNewEdLevel(e.target.value)}></input>

                            <label class="label-addsc">Parent Cluster</label>
                            <select id="select-cluster" value={clusterID} onChange={(e) => setClusterID(e.target.value)} >
                                <option value="" disabled selected hidden className="hidden">Select one</option>
                                {clusters.map((cluster) => (
                                    <option key={cluster.id} value={cluster.id} >
                                        {cluster.clusterName}
                                    </option>
                                ))}
                            </select>

                            </div>
                            <div className="newsc-right">
                            <label class="label-addsc" for="subclusterDescrip">Description</label>
                            <textarea type="text" id="subclusterDescrip" maxLength="200" name="subclusterDescrip" placeholder=" Enter new description." value={newSCDescrip} onChange={(e) => setNewDescrip(e.target.value)}></textarea>
                            
                            <label class="label-addsc" for="rate">Growth Rate</label>
                            <select id="growth-rate" name="rate" value={newSCGrowthRate} onChange={(e) => setNewGrowthRate(e.target.value)} >
                                <option>Select Growth Rate</option>
                                <option value="High">High</option>
                                <option value="Medium">Medium</option>
                                <option value="Low">Low</option>
                            </select>

                            <label class="label-addsc" for="img">Image</label>
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


                <h1>SubCluster Management Page</h1>
            </div>

            <ul className="scmgmt_list">
                {subClusters2.map((subcluster) => (
                    <li>
                        <ManagementSubCluster key={subcluster.id} ID={subcluster.id} subclusterName={subcluster.subclusterName} />
                    </li>
                ))}
            </ul>


            <BottomRectangle/>
        </div>
    )
}

export default SubClusterManagementPage;