/*
Required modules:
- 'express': For creating the Express application.
- 'mysql2': For interacting with MySQL databases.
- 'cors': For enabling Cross-Origin Resource Sharing.
- 'multer': For handling multipart/form-data, primarily used for file uploads.
- 'firebase-admin': For Firebase authentication.

LAST EDITED 04/05/2024 Gavin T. Anderson
*/

// Import required modules
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();
const multer = require('multer');
const admin = require('firebase-admin');

// Import Firebase service account credentials
const serviceAccount = require('./firebase-admin-sdk/career-clusters-9dcc3-firebase-adminsdk-nggr9-ddf5aa127a.json');

// Initialize Firebase Admin SDK with service account credentials
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Middleware function to check user authentication using Firebase Auth
async function checkAuth(req, res, next) {
  const token = req.headers.authorization?.split('Bearer ')[1];
  if (!token) {
    return res.status(401).send('Back-end authentication failed: Access token is missing or invalid.');
  }
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    console.log('Authenticated user token making request:', decodedToken);
    next();
  } catch (e) {
    console.error('Error verifying Firebase ID token:', e);
    res.status(403).send('Back-end authentication failed: Failed to authenticate token.');
  }
}

// Configure multer for handling file uploads
const upload = multer({ storage: multer.memoryStorage() });

// Use the mysqlConnection object to perform database operations
// ...

// Start your Express server

app.use(express.json());
// app.use(cors()); //currently allows cross-origin access control
app.use(cors({
  origin: 'http://localhost:3000',    //add YCRC domain when ready to hand off 
  credentials: true,
}))

const pool = mysql.createPool({
  host: 'deltona.birdnest.org',
  user: 'my.vaughnk3',
  password: '09cc!369y',
  database: 'my_vaughnk3_career_cluster',
  waitforConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

//Test Connection
pool.getConnection((err, connection) => {
  if(err) {
    console.error('Error connecting to MySQL:', err);
  } else {
    console.log('MySQL connection established successfully');
    connection.release();
  }
})



//IMAGE POST FROM CLUSTER MANAGEMENT
//check if logged in, verify if image
app.post('/imag-cluster-replace', upload.single('image'), checkAuth, (req, res) => {
  const image = req.file.buffer;
  const clusterId = req.body.id;
  pool.query('UPDATE Cluster SET img = ? WHERE id = ?', 
  [image, clusterId], 
  (error, results, fields) => {
    if(error) {
      console.error("Error adding demographic information: ", error);
      res.status(500).send("Error adding demographic information");
    } else {
      console.log("Added demographic information successfully");
      res.status(200).send("Added demographic information successfully");
    }
  }
  )
})

//SUBCLUSTER UPDATE IMAGE
app.post('/subimage-replace', upload.single('image'), checkAuth, (req, res) => {
  const image = req.file.buffer;
  const subClusterId = req.body.id;
  pool.query('UPDATE Subcluster SET img = ? WHERE id = ?', 
  [image, subClusterId], 
  (error, results, fields) => {
    if(error) {
      console.error("Error adding demographic information: ", error);
      res.status(500).send("Error adding demographic information");
    } else {
      console.log("Added demographic information successfully");
      res.status(200).send("Added demographic information successfully");
    }
  }
  )
})

// Get subcluster image
app.get('/subclust-img-pull/:id', async (req, res) => {
  const { id } = req.params;
  pool.query('SELECT img FROM Subcluster WHERE id = ?', [id], (error, results) => {
    if (error) {
      console.error("Error fetching image: ", error);
      return res.status(500).send("Error fetching image");
    }
    if (results.length > 0) {
      const image = results[0].img;
      res.writeHead(200, {
        'Content-Type': 'image/png', // Or the correct content type for your image
      });
      res.end(image);
    } else {
      res.status(404).send('Image not found');
    }
  });
});


// get the cluster images for a particular cluster
app.get('/n-image/:id', async (req, res) => {
  const { id } = req.params;
  pool.query('SELECT img FROM Cluster WHERE id = ?', [id], (error, results) => {
    if (error) {
      console.error("Error fetching image: ", error);
      return res.status(500).send("Error fetching image");
    }
    if (results.length > 0) {
      const image = results[0].img;
      res.writeHead(200, {
        'Content-Type': 'image/png', // Or the correct content type for your image
      });
      res.end(image);
    } else {
      res.status(404).send('Image not found');
    }
  });
});


//************************************************************************/
//Excel sheet get cluster names and click rates. 
app.get('/excel-clusters', (req, res) => {
  pool.query('SELECT clusterName, clickCount FROM Cluster', (error, results, fields) => {
    if(error) {
      console.error(error);
      console.log('Sad error fetching information from Cluster table')
      res.status(500).send('Error fetching information from Cluster table in database')
    } else {
      res.json(results);
      console.log('Cluster results: ', results)
    }
  })
})
//************************************************************************/



//************************************************************************/
//Excel sheet get cluster names and click rates. 
app.get('/dem-info', (req, res) => {

  pool.query('SELECT * FROM UserDemographicInfo', (error, results, fields) => {
    if(error) {
      console.error(error);
      console.log('Sad error fetching information from Cluster table')
      res.status(500).send('Error fetching information from Cluster table in database')
    } else {
      res.json(results);
      console.log('Cluster results: ', results)
    }
  })
})
//************************************************************************/




//************************************************************************/
//GENERAL VIEW SELECT ALL CLUSTERS
app.get('/gen-subclusters', (req, res) => {
  pool.query('SELECT subclusterName, clickCount FROM Subcluster', (error, results, fields) => {
    if(error) {
      console.error(error);
      console.log('Sad error fetching information from Cluster table')
      res.status(500).send('Error fetching information from Cluster table in database')
    } else {
      res.json(results);
      console.log('Cluster results: ', results)
    }
  })
})
//************************************************************************/





//************************************************************************/
// Get list of schools for demographic page
app.get('/school', (req, res) => {
  console.log('Recieved GET request to /school/test!')
  pool.query('SELECT * FROM School ORDER BY schoolName', (error, results, fields) => {
    if(error) {
      console.error(error);
      console.log('Sad error fetching information from School table')
      res.status(500).send('Error fetching information from School table in database')
    } else {
      res.json(results);
      console.log('School results: ', results)
    }
  })
})
//************************************************************************/

app.post('/manage-school-name', checkAuth, (req, res) => {
  
  const { newSchoolName, ID } = req.body;
  console.log("I GOT IT, ", newSchoolName, " ", ID);
  pool.query(
    'UPDATE School SET schoolName = ? where id = ?',
    [ newSchoolName , ID] ,
    (error, results, fields) => {
      if(error) {
        console.error("Error adding demographic information: ", error);
        res.status(500).send("Error adding demographic information");
      } else {
        console.log("Added demographic information successfully");
        res.status(200).send("Added demographic information successfully");
      }
    }
  )
})


app.post('/new-school', checkAuth, (req, res) => {
  
  const { newSchool} = req.body;
  pool.query(
    'INSERT INTO School (schoolName) VALUES (?)',
    [ newSchool] ,
    (error, results, fields) => {
      if(error) {
        console.error("Error adding demographic information: ", error);
        res.status(500).send("Error adding demographic information");
      } else {
        console.log("Added demographic information successfully");
        res.status(200).send("Added demographic information successfully");
      }
    }
  )
})

//Delete school
app.post('/del-school', checkAuth, (req, res) => {
  const { ID } = req.body;
  pool.query(
    'DELETE FROM School WHERE id = ?',
    [ ID ] ,
    (error, results, fields) => {
      if(error) {
        console.error("Error deleting school: ", error);
        res.status(500).send("Error deleting school");
      } else {
        console.log("deleting school successfully");
        res.status(200).send("deleting school successfully");
      }
    }
  )
})





//************************************************************************/
// Send collected demographic information to database
app.post('/demographicinfo', (req, res) => {
  const { school, gradeLevel, desiredCareerField, currentAge } = req.body;
  pool.query(
    'INSERT INTO UserDemographicInfo (userID, school, gradeLevel, desiredCareerField, currentAge) VALUES (NULL, ?, ?, ?, ?)',
    [school, gradeLevel, desiredCareerField, currentAge ],
    (error, results, fields) => {
      if(error) {
        console.error("Error adding demographic information: ", error);
        res.status(500).send("Error adding demographic information");
      } else {
        console.log("Added demographic information successfully");
        res.status(200).send("Added demographic information successfully");
      }
    }
  )
})
//************************************************************************/

//************************************************************************/
//GENERAL VIEW SELECT ALL CLUSTERS
app.get('/cluster', (req, res) => {
  console.log('Recieved GET request to /cluster')
  pool.query('SELECT * FROM Cluster ORDER BY clusterName', (error, results, fields) => {
    if(error) {
      console.error(error);
      console.log('Sad error fetching information from Cluster table')
      res.status(500).send('Error fetching information from Cluster table in database')
    } else {
      res.json(results);
      console.log('Cluster results: ', results)
    }
  })
})
//************************************************************************/



//************************************************************************/
// GET ALL CLUSTERS FOR THE CLUSTER MANAGEMENT PAGE LIST -- STAFF VIEW/ADMIN VIEW
app.get('/login/staffclusters/clustermanagementpage', (req, res) => {
  pool.query('SELECT * FROM Cluster ORDER BY clusterName', (error, results, fields) => {
    if(error) {
      console.error(error);
      console.log('Sad error fetching information from Cluster table')
      res.status(500).send('Error fetching information from Cluster table in database')
    } else {
      res.json(results);
      console.log('Cluster results: ', results)
    }
  })
})
//************************************************************************/


//************************************************************************/
//GET ALL CLUSTERS FOR THE STAFF VIEW PAGE -- STAFF/ADMIN
app.get('/login/staffclusters', (req, res) => {
  pool.query('SELECT * FROM Cluster ORDER BY clusterName', (error, results, fields) => {
    if(error) {
      console.error(error);
      console.log('Sad error fetching information from Cluster table')
      res.status(500).send('Error fetching information from Cluster table in database')
    } else {
      res.json(results);
      console.log('Cluster results: ', results)
    }
  })
})
//************************************************************************/

//************************************************************************/
// Gets all the subclusters to be displayed on subcluster managment page
/*
app.get('/subclustermanagementpage', (req, res) => {
  pool.query('SELECT * FROM Subcluster', (error, results, fields) => {
    if(error) {
      console.error(error);
      console.log('Sad error fetching information from Cluster table')
      res.status(500).send('Error fetching information from Cluster table in database')
    } else {
      res.json(results);
      console.log('Subcluster :) results: ', results)
    }
  })
})*/


app.get('/subclustermanagementpage/:clusterId', (req, res) => {
  const { clusterId } = req.params;
  pool.query('SELECT * FROM Subcluster WHERE clusterId = ?', [ clusterId ], (error, results, fields) => {
    if(error) {
      console.error(error);
      console.log('Sad error fetching information from Cluster table')
      res.status(500).send('Error fetching information from Cluster table in database')
    } else {
      res.json(results);
      console.log('Subcluster :) results: ', results)
    }
  })
})

//************************************************************************/

//************************************************************************/
//ADD CLUSTER
app.post('/login/staffclusters/clustermanagementpage/add-cluster', upload.single('image'), checkAuth, (req, res) => {
  const image = req.file.buffer;
  const clusterName = req.body.clusterName;
  pool.query(
    'INSERT INTO Cluster (clusterName, img) VALUES (?, ?)',
    [clusterName, image],
    (error, results, fields) => {
      if(error) {
        console.error('Error adding Cluster:', error);
        res.status(500).send('Error adding Cluster');
      } else {
        console.log('Cluster added successfully');
        res.status(200).send('Cluster added successfully')
      }
    }
  )
})
//************************************************************************/

//Public request
app.post('/update-clust-clickCnt', (req, res) => {
  const { clusterID } = req.body;
  pool.query(
    'UPDATE Cluster SET clickCount = clickCount + 1 where id = ?', 
    [clusterID], 
    (error, results, fields) => {
      if(error) {
        console.error('Error updating Cluster click count', error);
        res.status(500).send('Error updatingCluster click count');
      } else {
        console.log('Cluster click count updated successfully, new val:   ');
        res.status(200).send('Cluster click count updated successfully')
      }
    }
  )
})


//Public request
app.post('/updates-subclust-clickCnt', (req, res) => {
  const { subclusterID } = req.body;
  pool.query(
    'UPDATE Subcluster SET clickCount = clickCount + 1 where id = ?', 
    [subclusterID], 
    (error, results, fields) => {
      if(error) {
        console.error('Error updating SubCluster click count', error);
        res.status(500).send('Error updating SubCluster click count');
      } else {
        console.log('Sub Cluster click count updated successfully, new val:   ');
        res.status(200).send('Sub Cluster click count updated successfully')
      }
    }
  )
})


//************************************************************************/
// EDIT CLUSTER NAME
app.post('/login/staffclusters/clustermanagementpage/edit-cluster-name', checkAuth, (req, res) => {
  const { clusterName, ID } = req.body;
  pool.query(
    'UPDATE Cluster SET clusterName = ? WHERE id = ?',
    [clusterName, ID],
    (error, results, fields) => {
      if(error) {
        console.error('Error updating Cluster:', error);
        res.status(500).send('Error updatingCluster');
      } else {
        console.log('Cluster name updated successfully   ', ID, clusterName);
        res.status(200).send('Cluster name updated successfully')
      }
    }
  )
})
//************************************************************************/


//************************************************************************/
//DELETE CLUSTER
app.post('/login/staffclusters/clustermanagementpage/delete-cluster', checkAuth, (req, res) => {
  const { ID } = req.body;
  pool.query(
    'DELETE FROM Cluster WHERE id = ?',
    [ID],
    (error, results, fields) => {
      if(error) {
        console.error('Error adding Cluster:', error);
        res.status(500).send('Error adding Cluster');
      } else {
        console.log('Cluster added successfully');
        res.status(200).send('Cluster added successfully')
      }
    }
  )
})
//************************************************************************/


//************************************************************************/
// Update request to update a subcluster name based on ID
app.post('/subclustermanagementpage/edit-subcluster-name',checkAuth, (req, res) => {
  const { subclusterName, ID } = req.body;
  pool.query(
    'UPDATE Subcluster SET subclusterName = ? WHERE id = ?',
    [subclusterName, ID],
    (error, results, fields) => {
      if(error) {
        console.error('Error updating Cluster:', error);
        res.status(500).send('Error updatingCluster');
      } else {
        console.log('Cluster name updated successfully   ', ID, subclusterName);
        res.status(200).send('Cluster name updated successfully')
        pool.query (
          'UPDATE Field SET fieldName = ? where subclusterID = ?',
          [subclusterName, ID],
          (error, results, fields) => {
            if (error)
            {
              console.error('Error updating Cluster:', error);
              //res.status(500).send('Error updatingCluster');
            }
            else {
              console.log('Cluster name updated successfully   ', ID, subclusterName);
             // res.status(200).send('Cluster name updated successfully')
            }
          }
        )
      }
    }
  )
})
//************************************************************************/


//************************************************************************/
//Update request for updating a subcluster's description
app.post('/subclustermanagementpage/edit-subcluster-descrip', checkAuth, (req, res) => {
  const { subclusterDescrip, ID } = req.body;
  pool.query(
    'UPDATE Field SET description = ? WHERE subclusterId = ?',
    [subclusterDescrip, ID],
    (error, results, fields) => {
      if(error) {
        console.error('Error updating Cluster:', error);
        res.status(500).send('Error updatingCluster');
      } else {
        console.log('Cluster name updated successfully   ', ID, subclusterDescrip);
        res.status(200).send('Cluster name updated successfully')
      }
    }
  )
})
//************************************************************************/


//************************************************************************/
// Update request for updating the education level of a subcluster
app.post('/subclustermanagementpage/edit-subcluster-education', checkAuth, (req, res) => {
  const { subclusterEducation, ID } = req.body;
  pool.query(
    'UPDATE Field SET educationLvl = ? WHERE subclusterId = ?',
    [subclusterEducation, ID],
    (error, results, fields) => {
      if(error) {
        console.error('Error updating Cluster:', error);
        res.status(500).send('Error updatingCluster');
      } else {
        console.log('Cluster name updated successfully   ', ID, subclusterEducation);
        res.status(200).send('Cluster name updated successfully')
      }
    }
  )
})
//************************************************************************/


//************************************************************************/
// Update request for updating the salary of a subcluster
app.post('/subclustermanagementpage/edit-subcluster-salary', checkAuth, (req, res) => {
  const { subclusterSalary, ID } = req.body;
  pool.query(
    'UPDATE Field SET avgSalary = ? WHERE subclusterId = ?',
    [subclusterSalary, ID],
    (error, results, fields) => {
      if(error) {
        console.error('Error updating Cluster:', error);
        res.status(500).send('Error updatingCluster');
      } else {
        console.log('Cluster name updated successfully   ', ID, subclusterSalary);
        res.status(200).send('Cluster name updated successfully')
      }
    }
  )
})
//************************************************************************/


//************************************************************************/
//DELETE SUBCLUSTER
app.post('/subclustermanagementpage/delete-subcluster', checkAuth, (req, res) => {
  const { ID } = req.body;
  pool.query(
    'DELETE FROM Subcluster WHERE id = ?',
    [ID],
    (error, results, fields) => {
      if(error) {
        console.error('Error deleting subcluster:', error);
        res.status(500).send('Error deleting subCluster');
      } else {
        console.log('Cluster deleted successfully');
        res.status(200).send('Cluster deleted successfully')
      }
    }
  )
})
//************************************************************************/


//************************************************************************/
// Update request for updating the growth rate of a subcluster
app.post('/subclustermanagementpage/edit-subcluster-growthrate', checkAuth, (req, res) => {
  const { subclusterGrowthRate, ID } = req.body;
  console.log("NEW GR", subclusterGrowthRate)
  pool.query(
    'UPDATE Field SET growthRate = ? WHERE subclusterId = ?',
    [subclusterGrowthRate, ID],
    (error, results, fields) => {
      if(error) {
        console.error('Error updating Cluster:', error);
        res.status(500).send('Error updatingCluster');
      } else {
        console.log('Cluster name updated successfully   ', ID, subclusterGrowthRate);
        res.status(200).send('Cluster name updated successfully')
      }
    }
  )
})
//************************************************************************/

app.post('/subclustermanagementpage/change-schools', checkAuth, (req, res) => {
  const { updatedSchools, ID } = req.body;
  pool.query(
    'UPDATE Field SET schoolList = ? WHERE subclusterId = ?', 
    [updatedSchools, ID],
    (error, results, fields) => {
      if(error) {
        console.error('Error updating school list, ', error);
        res.status(500).send('Error updating school name');
      } else {
        console.log('School list updated successfully');
        res.status(200).send('School list updated successfully')
      }
    }
  )
})


//************************************************************************/
// Insert request for adding subcluster into subcluster table
app.post('/subclustermanagementpage/add-subcluster', upload.single('image'), checkAuth, (req, res) => {
  const image = req.file.buffer;
  const newSCName = req.body.subclusterName;
  const clusterID = req.body.clusterID;
  pool.query(
    'INSERT INTO Subcluster (clusterId, subclusterName, img) VALUES (?, ?, ?)',
    [clusterID, newSCName, image],
    (error, results, fields) => {
      if(error) {
        console.error('Error inserting subcluster: ', error);
        res.status(500).send('Error inserting subcluster :(');
      } else {
        const subclusterID = results.insertId;
        console.log("SUBCLUSTER ID (SERVER>JS)   ",subclusterID );
        console.log('Inserted into subcuster successfully ', newSCName);
        res.status(200).json({subclusterID});
      }
    }
  )
})

app.post('/subclustermanagementpage/add-subcluster-field', checkAuth, (req, res) => {
  //look at req (in headers)
  const { subclusterID, newSCName, newSCDescrip, newSCSalary, newSCEdLevel, newSCGrowthRate, newSchools} = req.body;
  pool.query(
    'INSERT INTO Field (subclusterID, fieldName, description, avgSalary, educationLvl, growthRate, schoolList) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [subclusterID, newSCName, newSCDescrip, newSCSalary, newSCEdLevel, newSCGrowthRate, newSchools],
    (error, results, fields) => {
      if(error) {
        console.error("Error inserting field: ", error);
        res.status(500).send('Error inserting field :(');
      } else {
        console.log('Inserted into field successfully :)', newSCName, "  ", newSCDescrip, "   ", newSCEdLevel, "   ", newSCSalary);
        res.status(200).send('Field inserted successfully!!');
      }
    }
  )
})

//************************************************************************/

//   /subclustermanagementpage/fetch-clusters
app.get('/uniq-clust-dropdowns', (req, res) => {
  pool.query('SELECT * FROM Cluster ORDER BY clusterName', (error, results, fields) => {
    if(error) {
      console.error(error);
      console.log('Sad error fetching information from Cluster table')
      res.status(500).send('Error fetching information from Cluster table in database')
    } else {
      res.json(results);
      console.log('Cluster results: ', results)
    }
  })
})
//************************************************************************/

//************************************************************************/
//SELECT ALL SUBCLUSTERS PERTAINING TO THE CLUSTER ID PASSED IN FOR GENERAL VIEW
app.get('/cluster/subcluster/:clusterId', (req, res) => {
  const clusterId = req.params.clusterId;
  console.log(`Received GET request to /cluster/subcluster/${clusterId}`);
  pool.query('SELECT * FROM Subcluster WHERE clusterId = ?', [clusterId], (error, results, fields) => {
    if(error) {
      console.error(error);
      console.log('Sad error fetching information from Subcluster table');
      res.status(500).send('Error fetching information from Subcluster table in database');
    } else {
      res.json(results);
      console.log('Subcluster results: ', results);
    }
  })
})
//************************************************************************/

//************************************************************************/
//GRAB SUB CLUSTERS FOR STAFF /ADMIN VIEW
app.get('/login/staffclusters/staffsubclusters/:clusterId', (req, res) => {
  const clusterId = req.params.clusterId;
  console.log(`Received GET request to /cluster/subcluster/${clusterId}`);
  pool.query('SELECT * FROM Subcluster WHERE clusterId = ?', [clusterId], (error, results, fields) => {
    if(error) {
      console.error(error);
      console.log('Sad error fetching information from Subcluster table');
      res.status(500).send('Error fetching information from Subcluster table in database');
    } else {
      res.json(results);
      console.log('Subcluster results: ', results);
    }
  })
})
//************************************************************************/

//************************************************************************/
// GET ALL FIELD INFORMATION PERTAINING TO THE SUBCLUSTER ID PASSED FOR GENERAL VIEW.
app.get('/cluster/subcluster/subclusterinfo/:subclusterId', (req, res) => {
  const subclusterId = req.params.subclusterId;
  console.log(`Recieved GET request to /cluster/subcluster/subclusterinfo/${subclusterId}`);
  pool.query('SELECT * FROM Field WHERE subclusterId = ?', [subclusterId], (error, results, fields) => {
    if(error) {
      console.error(error);
      console.log('Sad error fetching information from Fields table');
      res.status(500).send('Error fetching information from Fields table in database');
    } else {
      res.json(results);
      console.log('Field results: ', results);
    }
  })
})
//************************************************************************/

//************************************************************************/
//GRAB ALL SUBCLUSTER FIEDLDS -- THIS IS FOR STAFF VIEW /ADMIN
app.get('/login/staffclusters/staffsubclusters/staffsubclusterinfo/:subclusterId', (req, res) => {
  const subclusterId = req.params.subclusterId;
  console.log(`Recieved GET request to /cluster/subcluster/subclusterinfo/${subclusterId}`);
  pool.query('SELECT * FROM Field WHERE subclusterId = ?', [subclusterId], (error, results, fields) => {
    if(error) {
      console.error(error);
      console.log('Sad error fetching information from Fields table');
      res.status(500).send('Error fetching information from Fields table in database');
    } else {
      res.json(results);
      console.log('Field results: ', results);
    }
  })
})
//************************************************************************/

//************************************************************************/
//RECIEVE USER ID AND PARTICULAR CLAIM TO BE ADDED, UPDATE FIREBASE WITH NEW PERMISSION FOR USER
app.post('/login/adminpage/modifyperms/add-user-permission', async (req, res) => {
  const { uid, claims } = req.body; // UID of user and claims to be set, passed from tickbox value in form in client
  try {
    console.log("IN ADD" , uid)
    console.log(claims)
    await admin.auth().setCustomUserClaims(uid, claims);
    res.send('Custom claims set successfully.');
  } catch(error) {
    console.error('Error setting custom claim: ', error);
    res.status(500).send('Failed to set custom claims.')
  }
})
//************************************************************************/


//************************************************************************/
//RECIEVE USER ID AND LIST OF CLAIMS TO REMOVE, UPDATE FIREBASE WITH REMOVED PERMISSIONS FOR USER
app.post('/login/adminpage/modifyperms/remove-user-permission', async (req, res) => {
  const { uid, claimsToRemove } = req.body;
  try {
    const user = await admin.auth().getUser(uid);
    const updatedClaims = {...user.customClaims};
    
    claimsToRemove.forEach(claim => {
      delete updatedClaims[claim];
    });

    await admin.auth().setCustomUserClaims(uid, updatedClaims); //reset user claims for user with deleted ones removed
    res.send('Custom claims removed successfully.');
  } catch(error) {
    console.error('Error removing custom claims:', error);
    res.status(500).send('Failed to remove custom')
  }
})
//************************************************************************/



app.get('/login/adminpage/modifyperms/list-users', async (req, res) => {
  try {
    const listUsersResult = await admin.auth().listUsers();
    const usersWithPermissions = listUsersResult.users.map(user => ({
      uid: user.uid,
      email: user.email,
      permissions: user.customClaims || {},
    }));

    res.json(usersWithPermissions);
  } catch (error) {
    console.error('Error listing users:', error);
    res.status(500).send('Internal server error');
  }
});


app.post('/login/adminpage/create-user', async (req, res) => {
  const { email, password } = req.body;
  //Try to create the user
  try {
    const userCredential = await admin.auth().createUser({
      email,
      password,
    });
    // Respond with the UID of the newly created user or other relevant information
    console.log(userCredential.uid)

    try {
    // Store the uid of the new user
    const uid = userCredential.uid;

    // Set the default claims
    const claims = {
      "uid": uid,
      "claims": {
        "Administrator": false,
        "Cluster Management": false,
        "SubCluster Management": false,
        "Export Excel": false,
        "Create Staff": false,
        "Modify Perms": false,
        "School Management":false,
        "Clear Click Counts":false
      }
    }

    // Set the new user's custom claims
    await admin.auth().setCustomUserClaims(uid, claims);
  } catch(error) {
    console.log(error);
  }
  
    res.status(200).json({ uid: userCredential.uid });
  } catch (error) {
    console.error('Failed to create user:', error);
    res.status(500).send('Error creating user');
  }
});

app.post('/get-unique-claims', async (req, res) => {
  const { uid } = req.body;

  try {
  const user = await admin.auth().getUser(uid);
  const claims = user.customClaims;
  console.log(claims);
  res.status(200).json({ claims })
  }
  catch (error) {
    console.log(error);
  }
})

// Wipe Cluster Click Counts
app.post('/wipe-cluster-clickCounts', checkAuth, (req, res) => {
  pool.query(
    'UPDATE Cluster SET clickCount = 0',
    (error, results, fields) => {
      if(error) {
        console.error("Error wiping cluster counts: ", error);
        res.status(500).send("Error wiping cluster counts");
      } else {
        console.log("Cluster counts wiped successfully");
        res.status(200).send("Cluster counts wiped successfully");
      }
    }
  )
})

// Wipe Subcluster Click Counts
app.post('/wipe-subcluster-clickCounts', checkAuth, (req, res) => {
  pool.query(
    'UPDATE Subcluster SET clickCount = 0',
    (error, results, fields) => {
      if(error) {
        console.error("Error wiping subcluster counts: ", error);
        res.status(500).send("Error wiping subcluster counts");
      } else {
        console.log("Subcluster counts wiped successfully");
        res.status(200).send("Subcluster counts wiped successfully");
      }
    }
  )
})

// Wipe Demographic Counts
app.post('/wipe-demographic-counts', checkAuth, (req, res) => {
  pool.query(
    'TRUNCATE TABLE UserDemographicInfo', 
    (error, results, fields) => {
      if(error) {
        console.error("Error wiping demographic counts: ", error);
        res.status(500).send("Error wiping demographic counts");
      } else {
        console.log("Demographic counts wiped successfully");
        res.status(200).send("Demographic counts wiped successfully");
      }
    }
  )
})



const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});