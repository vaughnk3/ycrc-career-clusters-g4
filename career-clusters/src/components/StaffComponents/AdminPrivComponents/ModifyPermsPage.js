import TopRectangle from "../../page_Components/TopRectangle";
import BottomRectangle from "../../page_Components/BottomRectangle";
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { claimsList } from "./permissionsList";
import './ModifyPermsPage.css'

/*
This file contains the Javascript code, GET requests to list current users, and POST requests
to add or remove a permission from a particular user. This page contains a table which is 
populated with all of the staff users (other than admin accounts), their corresponding permissions, 
and a button to display a popup form to update permissions.
Components:
BottomRectangle

KJ Vaughn
*/


//React component for modification of staff permissions
const ModifyPermsPage = () => {

    //State variables to keep track of user-inputted information
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState('');
    const [action, setAction] = useState('');
    const [selectedPermission, setSelectedPermission] = useState('');
    const [statusPopup, setStatusPopup] = useState(false);
    const [message, setMessage] = useState('');
    const [showForm, setShowForm] = useState(false);
    const permissionNames = Object.keys(claimsList.claims)

    const yesString = 'Yes';
    const noString = 'No';

    //Admin only permissions 
    const adminPermissions = ["Administrator", "Create Staff", "Modify Perms", "Clear Click Counts"];

    //Close status popup and refresh page
    const closeStatus = () => {
      setStatusPopup(false);
      window.location.reload();
    }

    //Close popup for modification of permissions
    const closeModifyPerms = () => {
      setShowForm(false);
      setAction('');
      setSelectedPermission('');
      setSelectedUser('');
    }


    //Send GET request to server to retrieve all staff users and their corresponding custom permissions 
    const UsersPermissionsList = () => {
        useEffect(() => {
          const fetchUsersAndPermissions = async () => {
            try {
              const response = await fetch('http://localhost:3001/login/adminpage/modifyperms/list-users', 
              );
              const data = await response.json();
              setUsers(data);
              /*
              if(data.length > 0) {
                //setAction('add')
                setSelectedUser(users[0].uid)
                //setSelectedPermission('Cluster Management')
              }
              */
            } catch (error) {
              console.error('Failed to fetch users and permissions:', error);
            }
          };
      
          fetchUsersAndPermissions();
        }, []);
    }

    //Render
    UsersPermissionsList();
    
    //Submit function which contains error handling for invalid inputs and updates for staff custom permissions based on admin input.
    //Sends selected user's ID, along with their desired updated list of permissions back to server for updating within Firebase.
    const handleSubmit = async (e) => {
      e.preventDefault();
      
      //Check if invalid input 
      if (selectedUser === '' || action === '' || selectedPermission === '') 
      {
        document.getElementById("user").style.outline = '2px solid red';
        document.getElementById("action").style.outline = '2px solid red';
        document.getElementById("permission").style.outline = '2px solid red';
      }

      else {
      console.log("LENGTH", users.length)
      console.log(users)
      console.log("single: ", users[0].permissions);
      console.log("UID", users[0].uid)


      // Initialize new claims list 
      let newClaimsList = {}

      // Find the claims list for the selected user
      for (let i = 0; i < users.length; i++)
      {
        if (selectedUser === users[i].uid) {
          newClaimsList = users[i].permissions;
        }
      }
     
      //console.log("NEW CLAIMS:", newClaimsList)
      //console.log("SPECIFIC: ", newClaimsList.claims[selectedPermission])
      //Iffy logic, not sure if list of all claims are being sent back 
      if(action === 'add') 
      {
        newClaimsList.claims[selectedPermission] = true;
      
      } else if (action === 'remove') 
      {
        newClaimsList.claims[selectedPermission] = false;
      }

      //Finally send user ID and updated custom permissions back to server to be updated within Firebase
      try {
        const response = await fetch('http://localhost:3001/login/adminpage/modifyperms/add-user-permission', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body:JSON.stringify({uid: selectedUser, claims: newClaimsList}),
        })

        //If POST request works, alert user
        if(response.ok) {
          console.log("Permissions updated successfully");
          setMessage('Successfully updated user permission.')
          setStatusPopup(true);
        //Otherwise, set failure popup and alert user
        } else {
          setMessage('Failed to update user permission.')
          setStatusPopup(true);
          throw new Error("Failed to update permission")
        }
      } catch (error) {
        setMessage('Failed to update user permission.')
        setStatusPopup(true);
        console.error("Error updating permissions: ", error);
      }
    }
      //console.log(payload.claims);
    }
    
    //Change state of popup used to show form to modify user permissions 
    const modifyPermissions = () => {
      setShowForm(!showForm);
    }

    const navigate = useNavigate();

    const handleBackButton = () => {
      navigate('/login/adminpage/')
  }
    
    //Return the HTML & elements used to populate staff user accounts, their corresponding permissions, and button which displays popup for admin to modify staff permissions  
    return (
        <div id="page">
            <div id="_topRectangle">
              <div class="management-header">
              <div class="management-button-header">
                <button class="management-header-button single" onClick={handleBackButton}>Back</button>
              </div>
                <div class="management-header-text">
                  <h2>Modify Permissions Page</h2>
                  <h4>View all user permissions, and make changes to them.</h4>
                </div>
                <div class="management-button-header">
                <button class="management-header-button single" onClick={modifyPermissions}>Modify Permissions</button>
              </div>
              </div>
            </div>

            <div className="content content-margin">
            <table id="permissions-table">
              <tr>
                <th></th>
                <th>Administrator</th>
                <th>Cluster Management</th>
                <th>SubCluster Management</th>
                <th>Export Excel</th>
                <th>Create Staff</th>
                <th>Modify Perms</th>
                <th>School Management</th>
                <th>Clear Click Counts</th>
              </tr>
              {users.map(user => (
                <tr>
                  <td>{user.email}</td>
                  <td>
                    {user.permissions.claims["Administrator"] ? yesString : noString}
                  </td>
                  <td>
                    {user.permissions.claims["Cluster Management"] ? yesString : noString}
                  </td> 
                  <td>
                    {user.permissions.claims["SubCluster Management"] ? yesString : noString}
                  </td> 
                  <td>
                    {user.permissions.claims["Export Excel"] ? yesString : noString}
                  </td> 
                  <td>
                    {user.permissions.claims["Create Staff"] ? yesString : noString}
                  </td> 
                  <td>
                    {user.permissions.claims["Modify Perms"] ? yesString : noString}
                  </td> 
                  <td>
                    {user.permissions.claims["School Management"] ? yesString : noString}
                  </td> 
                  <td>
                    {user.permissions.claims["Clear Click Counts"] ? yesString : noString}
                  </td>                 
                </tr>
              ))}
            </table>
            </div>
            
{showForm && (
  <div className="form-backdrop">
    <form id="userUpdate" className="form-modal" onSubmit={handleSubmit}>
        <div id="userSelect">
            <label htmlFor="user">User</label><br></br>
            <select id="user" name="user" value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)}>
            <option value="" disabled selected hidden className="hidden">Select a user</option>
            {users.map(user => {
              if (!user.permissions.claims["Administrator"]) {
                return <option key={user.uid} value={user.uid}>{user.email}</option>
              }
              return null;
            })}
            </select>
        </div>
        <div id="actionSelect">
            <label htmlFor="action">Action</label><br></br>
            <select id="action" name="action" value={action} onChange={(e) => setAction(e.target.value)}>
                <option value="" disabled selected hidden className="hidden">Select "Add" or "Remove"</option>
                <option value="add">Add</option>
                <option value="remove">Remove</option>
            </select>
        </div>
        <div id="permissionSelect">
            <label htmlFor="permission">Permission</label><br></br>
            <select id="permission" name="permission" value={selectedPermission} onChange={(e) => setSelectedPermission(e.target.value)}>
              <option value="" disabled selected hidden className="hidden">Select a permission</option>
                {permissionNames.map(permission => {
                  if (!adminPermissions.includes(permission)) {
                    return <option key={permission} value={permission}>{permission}</option>
                  }
                  return null;      
              })}
            </select>
        </div>
        <button class="cancelButton" onClick={closeModifyPerms}>Cancel</button>

        <button id="submitName" type="submit">Submit</button>

    </form>
  </div>
)}

          { statusPopup && (
            <div className="popup">
              <div className="popup-content">
                <h1>{message}</h1>
                <button onClick={closeStatus}>Acknowledge & Close</button>
              </div>
            </div>
          )}
          

        
            <BottomRectangle/>
        </div>
    )
}


export default ModifyPermsPage;