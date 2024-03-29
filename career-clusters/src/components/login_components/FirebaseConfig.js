import {initializeApp} from 'firebase/app';
import { getAnalytics } from "firebase/analytics";

/*
Define our Firebase credentials in one component that can be imported and used in other 
components throughout the application.  
*/

// This will be used in initializing our Firebase App within the application.
const firebaseConfig = {
    apiKey: "AIzaSyD1npOwsCve7cKnLGk7mwtUuesAmI_hwdU",
    authDomain: "career-clusters-9dcc3.firebaseapp.com",
    projectId: "career-clusters-9dcc3",
    storageBucket: "career-clusters-9dcc3.appspot.com",
    messagingSenderId: "884985748554",
    appId: "1:884985748554:web:29c9f24c69dd1cd8fcdab3",
    measurementId: "G-GJMD49N4ES"
  };

  // Initialize our Firebase app with the configuration credentials above.
  const app = initializeApp(firebaseConfig);

  // If ever needed, get the analytics for the application's Firebase App.
  const analytics = getAnalytics(app);


  //Export the app to be used elsewhere. 
  export default app;