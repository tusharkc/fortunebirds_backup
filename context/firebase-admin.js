import { getDatabase } from "firebase/database";
import admin from "firebase-admin";
import serviceAccount from "../secure.json";
import { initializeApp } from "firebase/app";

export function startFirebaseAdmin() {
  let adminApp;
  const configs = {
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://feathers-c926c-default-rtdb.firebaseio.com",
  };
  if (!admin.apps.length) {
    try {
      adminApp = initializeApp(configs, "adminDbApp");
    } catch (error) {}
  }

  return getDatabase(adminApp);
}
