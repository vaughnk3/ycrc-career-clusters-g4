import BottomRectangle from "../page_Components/BottomRectangle.js";
import UserIcon from "../page_Components/UserIcon.js";
import TopRectangle from "../page_Components/TopRectangle.js";
import './SubFieldPage.css'
import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';


const SubFieldsPage = () => {
    const { subclusterId } = useParams();
    const [ subFields, setSubFields] = useState([]);

    
    useEffect(() => {
        const fetchSubFields = async () => {
            try {
                const response = await fetch(`http://localhost:3001/cluster/subcluster/subclusterinfo/${subclusterId}`);
                if(!response.ok) {
                    throw new Error('Error fetching subcluster info');
                }
                const data = await response.json();
                setSubFields(data);
            } catch (error) {
                console.error('Error: ', error);
            }
        }
        fetchSubFields();
    }, [subclusterId])
    
    const field = subFields.length > 0 ? subFields[0] : {};

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
                    <a id="view-button" href="https://business.yorkcountychamber.com/jobs">View Job Postings</a>
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
                </div>
                </div>
                
            </div>
            <BottomRectangle/>
        </div>
    )
}



export default SubFieldsPage;