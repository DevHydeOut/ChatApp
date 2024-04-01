import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyDaUOLMCaj6bpLVoggD3dPg-8dG5Vg3N7k",
  authDomain: "chatapp-19aa2.firebaseapp.com",
  projectId: "chatapp-19aa2",
  storageBucket: "chatapp-19aa2.appspot.com",
  messagingSenderId: "417735652272",
  appId: "1:417735652272:web:9ba758cff42f25e7b49c75"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth, app }