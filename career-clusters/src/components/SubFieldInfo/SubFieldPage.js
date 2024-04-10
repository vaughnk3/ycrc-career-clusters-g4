/*
Component for displaying information about subfields.

Features:
- Fetches subfields data based on the subcluster ID from the server.
- Displays information about the subfield including name, description, average salary, education level, and growth rate.
- Provides a link to view job postings related to the subfield.
- Displays loading animation while fetching data.

Dependencies:
- BottomRectangle: Component for displaying a bottom rectangle.
- UserIcon: Component for displaying user icon.
- TopRectangle: Component for displaying a top rectangle.
- SubFieldPage.css: CSS file for styling the SubFieldsPage component.

Props:
None

LAST MODIFIED 04/05/2024 Gavin T. Anderson
*/

// Imports
import BottomRectangle from "../page_Components/BottomRectangle.js";
import UserIcon from "../page_Components/UserIcon.js";
import TopRectangle from "../page_Components/TopRectangle.js";
import './SubFieldPage.css'
import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';


const SubFieldsPage = () => {
    // Get the subcluster ID from the URL params
    const { subclusterId } = useParams();
    // State for storing subfields data
    const [ subFields, setSubFields] = useState([]);

    // Fetch subfields data from the server based on the subcluster ID
    useEffect(() => {
        const fetchSubFields = async () => {
            try {
                const response = await fetch(`http://localhost:3001/cluster/subcluster/subclusterinfo/${subclusterId}`);
                if(!response.ok) {
                    throw new Error('Error fetching subcluster info');
                }
                const data = await response.json();
                setSubFields(data);
                console.log(data);
                console.log(subclusterId)
                console.log(subFields)
            } catch (error) {
                console.error('Error: ', error);
            }
        }
        fetchSubFields();
    }, [subclusterId])

    // Extract the first subfield from the subfields data
    const field = subFields.length > 0 ? subFields[0] : {};

    // Initialize variable to store the display content
    let displayWords = [];

    try {
        // Make sure that field and schoolList is defined
        if (field && field.schoolList) {
        // Split the text into an array of words
        const arrayOfSchoolWords = field.schoolList.split(/\s+/);
        
        // Map each word accordingly.
        displayWords = arrayOfSchoolWords.map((item, index) => {
            // If the word is really a link, return an <a> tag with the reference link and open in a new tab.  
            if (item.startsWith('http') || item.startsWith('www') || item.includes('://')) {
                return(
                    <a key={index} href={item} target="_blank" rel="noopener noreferrer">
                        {item}
                        <br></br>
                    </a>
                    
                )
            }
          // If it is just a normal word, return the word with breaks for spacing.  
            else {
                return <span key={index}> <br></br> {item} <br></br></span>
            }
        })
        }
    }
    catch (error) {
        console.log(error);
    }

    // Render the component
    return (
        <div id="page">
            <div id="_topRectangle">
                <p>Here is some information about the {field.fieldName} career.</p>
            </div>
            <UserIcon/>
            <div class="content content-margin">
                <div id="subfield-content">
                <div id="row">
                    <div id="topLeft">
                        <h2 id="fName">{field.fieldName}</h2>
                        <h2 id="fDesc">{field.description} </h2>
                    </div>
                    <a id="view-button" href="https://business.yorkcountychamber.com/jobs" target="_blank" rel="noopener noreferrer">View Job Postings</a>
                </div>
                <div id="bottomMiddle">
                    <div class="field-statistic">
                        <h2>Average Salary</h2>
                        <h1> ${field.avgSalary} </h1>
                    </div>
                    <div class="field-statistic">
                        <h2>Education Level</h2>
                        <h1>{field.educationLvl}</h1>
                    </div>
                    <div class="field-statistic">
                        <h2>Growth Rate</h2>
                        <h1>{field.growthRate}</h1>
                    </div>

                    <div class="field-statistic">
                        <h2>Higher Education Opportunities</h2>
                        <br></br>
                        <div>{displayWords}</div>
            
                    </div>
                </div>
                </div>
                
            </div>
            <BottomRectangle/>
        </div>
    )
}



export default SubFieldsPage;
//  <h1>{field.schoolList}</h1>
// <div dangerouslySetInnerHTML={{ __html: field.schoolList }}></div>