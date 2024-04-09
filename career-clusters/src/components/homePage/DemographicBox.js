import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import './DemographicBox.css';


/*
This file contains all the JSX code for the Demographic box in the center
of the home page of the application.  It has all 4 fields a user can give their anonymous 
information for.  
*/

const DemographicBox = () => {
  // fetch schools
  const [schools, setSchools] = useState([]);
  //Keep track if other is selected
  const [otherSelected, setOtherSelected] = useState(false);

  // Fetch schools for the dropdown menu
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

  // State variables to keep track of entered user demographic information
  const [school, setSchool] = useState('');
  const [gradeLevel, setGradeLevel] = useState('');
  const [desiredCareerField, setDesiredCareerField] = useState('');
  const [currentAge, setCurrentAge] = useState(undefined);

  // Define the navigate hook for forceful navigation
  const navigate = useNavigate();

  //Verify age entered is appropriate
  const handleAgeChange = (event) => {
    var age = event.target.value;
    if (age > 0 && age <= 110)
      setCurrentAge(age);
  }


  //Verify required fields have been met, if so, send info to the database
  const sendDemographicInfo = async () => {
    var canSend = true;
    //If school has not been selected, highlight red
    if (school == "") {
      document.getElementById("school-select").style.outline = '2px solid red';
      document.getElementById("required-text").style.color = 'red';
      canSend = false;
    }

    // If grade level has not been selected, highlight red.
    if (gradeLevel == "") {
      document.getElementById("grade").style.outline = '2px solid red';
      document.getElementById("required-text").style.color = 'red';
      canSend = false;
    }

    // If all required fields are met, send the demographic info to DB
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

      // Navigate to cluster page
      navigate('/cluster');
    }
  }

  //Properly handle the user selecting a school, or selecting other.
  const handleSchoolChange = (e) => {
    console.log("In handler")
    if (e.target.value === "other") 
    {
      //Brings up the popup
      setOtherSelected(true);

      //If a different school was previously selected, wipe it
      setSchool('');
      console.log("in set")
    }
    //If its a regular school selected, set the school 
    else
    {
    setSchool(e.target.selectedOptions[0].text)
    }
  }

  //Before you can submit "other" school, test to see if it is valid
  //If not, highlight red and prevent submission
  const handleOtherSubmit = () => {
    //If its a blank submission, highlight red
    const schoolName = school;
    if (schoolName === '')
    {
      document.getElementById("other-school").style.border = '2px solid red';
    }
    // If it is a good name, close the popup.
    else {
      //Retrieve element, create a new element with given input and add that to selection list 
      const schoolSelect = document.getElementById("school-select");
      const newOption = document.createElement("option");
      newOption.value = "other-custom";
      newOption.text = schoolName;
      newOption.selected = true;
      schoolSelect.add(newOption);

      handleCloseOther()
    }
  }
  
  // Handler for closing the popup for "other" school.
  const handleCloseOther = () => {
    setOtherSelected(false);
  }

  

  useEffect(() => {
    try {
    const input = document.getElementById('age-input');

    // Prevent non-numeric characters
    input.addEventListener('keypress', function(event) {
      const charCode = event.which ? event.which : event.keyCode;
      // Allow only numeric characters
      if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        event.preventDefault();
      }
    });

    // Prevent paste of non-numeric characters
    input.addEventListener('paste', function(event) {
      const pasteData = event.clipboardData.getData('text/plain');
      if (pasteData.match(/[^0-9]/)) {
        event.preventDefault();
      }
    });

    // Validate on input change to ensure positive numbers only
    input.addEventListener('input', function() {
      if (this.value < 0) {
        this.value = '';
      }
    });

    // This allows users to clear the field using backspace
  input.addEventListener('keydown', function(event) {
    if (event.key === 'Backspace' && this.value.length <= 1) {
      this.value = ''; // Clear the input if only one digit is left and backspace is pressed
    }
  });
}
  catch (error) {
    console.log(error);
  }
  
  }, []);

  // Return the HTML for the demographic info box.  CSS is in DemographicBox.css
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
                <h1>Please enter your school of attendance below.</h1>
                <input id="other-school" type="text" placeholder="Please enter here." onChange={(e) => setSchool(e.target.value)}></input>
                <button onClick={handleOtherSubmit}>Submit</button>
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
           <option value="12">12</option>
           <option value="12+">12+</option>
          </select>
        </div>
        <div class="demographic-item">
          <h3>Age</h3>
          <input id="age-input" type="number" min="0" class="select" name="fname" placeholder='Please input your age here' value={currentAge} onChange={handleAgeChange}></input>
          
        </div>
      </div>


      <a href="#" class="demographic-button" onClick={sendDemographicInfo}>Submit</a>
    </div>
  );
};


// Export the completed component
export default DemographicBox;