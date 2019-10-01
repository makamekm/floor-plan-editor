import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import {
  configApiKey,
  configAppId,
  configAuthDomain,
  configDatabaseURL,
  configMeasurementId,
  configMessagingSenderId,
  configProjectId,
  configStorageBucket,
  Configuration,
} from "./configuration";

const config = {
  apiKey: Configuration.getStringValue(configApiKey),
  authDomain: Configuration.getStringValue(configAuthDomain),
  databaseURL: Configuration.getStringValue(configDatabaseURL),
  projectId: Configuration.getStringValue(configProjectId),
  storageBucket: Configuration.getStringValue(configStorageBucket),
  messagingSenderId: Configuration.getStringValue(configMessagingSenderId),
  appId: Configuration.getStringValue(configAppId),
  measurementId: Configuration.getStringValue(configMeasurementId),
};

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}
