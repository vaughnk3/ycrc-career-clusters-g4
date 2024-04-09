import TopRectangle from "../page_Components/TopRectangle";
import BottomRectangle from "../page_Components/BottomRectangle";
import OverlayRectangle from "../StaffComponents/OverlayRectangle";
import {useNavigate} from "react-router-dom"
import { getAuth, signOut } from "firebase/auth";
import { ExcelGenerationQueue } from "../StaffComponents/ExcelGeneration";
import { useEffect, useState } from "react";
import JobPod from "./JobPod";

/*
This file contains the placeholder data and functions for the potentially implemented
job listing page. 

KJ Vaughn
*/

//Placeholder job listing page component
const JobListingPage = () => {

  // If the page is loading, we use this to decide when to run the loading animation.
  const [loading, setLoading] = useState(false);
  // UPDATE UPDATE UPDATE UPDATE ^^^^^^^^^^^^^^^




  // If in loading state, render loading animation.
  if (loading) {
    return <div id="loading-animation"></div>
  }


    return (
      <div id="page">
        <div id="topRectangle">
          <h3>Here are all the job listings for the particular SubCluster selected.</h3>
        </div>


        <JobPod jobTitle={"New job"}> </JobPod>

        <JobPod jobTitle={"second job"}> </JobPod>
        <JobPod jobTitle={"third job"}> </JobPod>




        <BottomRectangle/>
      </div>
    )
}


export default JobListingPage;