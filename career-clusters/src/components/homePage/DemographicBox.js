import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import './DemographicBox.css';


const DemographicBox = () => {
  // fetch schools
  const [schools, setSchools] = useState([]);
  const [otherSelected, setOtherSelected] = useState(false);

  useEffect(() => {
      const fetchSchools = async () => {
          try { 
              const response = await (fetch('http://localhost:3001/school'));
              if(!response.ok) {
                  throw new Error('Error fetching schools');
              }
              const data = await response.json();
              //console.log(data)

              setSchools(data);
              
          } catch (error) {
              console.error('Error: ', error);
          }
      }
      fetchSchools();
  }, []);

  // fetch clusters
  const [clusters, setClusters] = useState([]);

  useEffect(() => {
      const fetchClusters = async () => {
          try { 
              const response = await (fetch('http://localhost:3001/cluster'));
              if(!response.ok) {
                  throw new Error('Error fetching clusters');
              }
              const data = await response.json();
              //console.log(data)

              setClusters(data);
              
          } catch (error) {
              console.error('Error: ', error);
          }
      }
      fetchClusters();
  }, []);

  const [school, setSchool] = useState('');
  const [gradeLevel, setGradeLevel] = useState('');
  const [desiredCareerField, setDesiredCareerField] = useState('');
  const [currentAge, setCurrentAge] = useState(undefined);

  const navigate = useNavigate();

  const handleAgeChange = (event) => {
    var age = event.target.value;
    if (age > 0 && age <= 200)
      setCurrentAge(age);
  }

  const sendDemographicInfo = async () => {
    var canSend = true;
    if (school == "") {
      document.getElementById("school-select").style.outline = '2px solid red';
      canSend = false;
    }
    if (gradeLevel == "") {
      document.getElementById("grade").style.outline = '2px solid red';
      canSend = false;
    }
    if (canSend) {
      try {
          const response = await(fetch('http://localhost:3001/demographicinfo', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({school, gradeLevel, desiredCareerField, currentAge})
          }));
          if (!response.ok)
              console.error('Failed to send demographic information');
      }   catch (error) {
          console.error('Error sending demographic information: ', error);
      }
      console.log('POST request sent from submit button');

      navigate('/cluster');
    }
  }

  const handleSchoolChange = (e) => {
    console.log("In handler")
    if (e.target.value === "other") 
    {
      setOtherSelected(true);
      console.log("in set")
    }
    else
    {
    setSchool(e.target.value)
    }
  }

  const handleCloseOther = () => {
    setOtherSelected(false);
  }

  return ( 
    <div id="demographic-box">
      <div id="demographic-box-container">
        <div class="demographic-item">
          <h3>School *</h3>
          <select id="school-select" name="school" class="select" onChange={handleSchoolChange}>
            <option value="" disabled selected hidden className="hidden">Select one</option>
            {schools.map((school) => (
                <option key={school.id} value={school.id} >
                    {school.schoolName}
                </option>
            ))}
            <option value="other">Other</option>
          </select>

          { otherSelected && (
            <div className="popup">
              <div className="popup-content">
                <h1>Test</h1>
                <input type="text" placeholder="Please enter your school of attendance." onChange={(e) => setSchool(e.target.value)}></input>
                <button onClick={handleCloseOther}>Submit</button>
                <button onClick={handleCloseOther}>Cancel</button>
              </div>
            </div>
          )}

        </div>
        <div class="demographic-item">
          <h3>Desired Career Field</h3>
          <select name="dField" class="select" onChange={(e) => setDesiredCareerField(e.target.selectedOptions[0].text)} >
            <option value="" disabled selected hidden class="hidden">Select one</option>
            {clusters.map((cluster) => (
                <option key={cluster.id} value={cluster.id} >
                    {cluster.clusterName}
                </option>
            ))}
          </select>
        </div>
        <div class="demographic-item">
          <h3>Grade *</h3>
          <select id="grade" class="select" onChange={(e) => setGradeLevel(e.target.value)}>
          <option value="" disabled selected hidden class="hidden">Select one</option>
           <option value="1">1</option>
           <option value="2">2</option>
           <option value="3">3</option>
           <option value="4">4</option>
           <option value="5">5</option>
           <option value="6">6</option>
           <option value="7">7</option>
           <option value="8">8</option>
           <option value="9">9</option>
           <option value="10">10</option>
           <option value="11">11</option>
           <option value="12">12</option>
          </select>
        </div>
        <div class="demographic-item">
          <h3>Age</h3>
          <input type="number" class="select" name="fname" placeholder='Please input your age here' value={currentAge} onChange={handleAgeChange}></input>
        </div>
      </div>


      <a href="#" class="demographic-button" onClick={sendDemographicInfo}>Submit</a>
    </div>
  );
};

export default DemographicBox;