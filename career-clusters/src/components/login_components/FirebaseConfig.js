import {initializeApp} from 'firebase/app';
import { getAnalytics } from "firebase/analytics";

//Replace this with firebase config info :) (Not sure what some of these fields would be)
const firebaseConfig = {
    apiKey: "AIzaSyD1npOwsCve7cKnLGk7mwtUuesAmI_hwdU",
    authDomain: "career-clusters-9dcc3.firebaseapp.com",
    projectId: "career-clusters-9dcc3",
    storageBucket: "career-clusters-9dcc3.appspot.com",
    messagingSenderId: "884985748554",
    appId: "1:884985748554:web:29c9f24c69dd1cd8fcdab3",
    measurementId: "G-GJMD49N4ES"
  };
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);

  export default app;