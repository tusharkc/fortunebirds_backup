import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

export function StartFirebase() {
  const firebaseConfig = {
    apiKey: "AIzaSyDKq9m8BKjiGBsmUR1DHtz68yxExpa3FSM",
    authDomain: "feathers-c926c.firebaseapp.com",
    databaseURL: "https://feathers-c926c-default-rtdb.firebaseio.com",
    projectId: "feathers-c926c",
    storageBucket: "feathers-c926c.appspot.com",
    messagingSenderId: "704876712626",
    appId: "1:704876712626:web:3dddad40b4690b284e6fab",
    measurementId: "G-SPTVMR2924",
  };
  const app = initializeApp(firebaseConfig);

  return getDatabase(app);
}
