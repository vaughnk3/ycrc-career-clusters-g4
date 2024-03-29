import TopRectangle from "../../page_Components/TopRectangle";
import BottomRectangle from "../../page_Components/BottomRectangle";
import React, { useState, useEffect } from 'react';
import { claimsList } from "./permissionsList";
import './ModifyPermsPage.css'

const ModifyPermsPage = () => {

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

    const adminPermissions = ["Administrator", "Create Staff", "Modify Perms", "Clear Click Counts"];

    const closeStatus = () => {
      setStatusPopup(false);
      window.location.reload();
    }

    const closeModifyPerms = () => {
      setShowForm(false);
    }


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

    UsersPermissionsList();
    

    const handleSubmit = async (e) => {
      e.preventDefault();
      
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

      //Finally communicate w backend to update user info
      try {
        const response = await fetch('http://localhost:3001/login/adminpage/modifyperms/add-user-permission', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body:JSON.stringify({uid: selectedUser, claims: newClaimsList}),
        })

        if(response.ok) {
          console.log("Permissions updated successfully");
          setMessage('Successfully updated user permission.')
          setStatusPopup(true);
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
   
    const modifyPermissions = () => {
      setShowForm(!showForm);
    }
    
    return (
        <div id="page">
            <div id="topRectangle">
              <button className="permsButton" onClick={modifyPermissions}>Modify Permissions</button>
              <h1>Modify Permissions Page</h1>
              <h3>View all user permissions, and make changes to them.</h3>
            </div>

            <div class="content content-margin">
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
        <button id="doneButton" onClick={closeModifyPerms}>Cancel</button>

        <button id="submitButton" type="submit">Submit</button>

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