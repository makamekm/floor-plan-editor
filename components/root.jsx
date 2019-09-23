import React from 'react'
import Head from 'next/head'
import { provider, useInstances } from 'react-ioc'
import { FloorProvider } from '../services/floor.provider';
import { ProjectListService } from "../services/project-list.service";
import { ProjectService } from '../services/project.service';
import { FloorListService } from "../services/floor-list.service";
import { FloorService } from "../services/floor.service";
import { BlueprintService } from "../services/blueprint.service";
import { FloorEditService } from '../services/floor-edit.service';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import firebase from 'firebase';
import { Configuration, configAuthDomain, configApiKey } from '../utils/configuration';

const config = {
  apiKey: Configuration.getStringValue(configApiKey),
  authDomain: Configuration.getStringValue(configAuthDomain),
};

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

const uiConfig = {
  // Popup signin flow rather than redirect flow.
  signInFlow: 'popup',
  // Redirect to /signedIn after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
  // signInSuccessUrl: '/',
  // We will display Google and Facebook as auth providers.
  signInOptions: [
    firebase.auth.EmailAuthProvider.PROVIDER_ID,
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
  ],
  callbacks: {
    // Avoid redirects after sign-in.
    signInSuccessWithAuthResult: () => false
  },
};

const services = [
  FloorProvider,
  FloorListService,
  ProjectListService,
  ProjectService,
  FloorService,
  BlueprintService,
  FloorEditService,
];

export default (Page) => {
  const Root = () => {
    let unregisterAuthObserver;
    useInstances(...services);
    React.useEffect(() => {
      if (process.browser) {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
        window.addEventListener('resize', () => {
          const vh = window.innerHeight * 0.01;
          document.documentElement.style.setProperty('--vh', `${vh}px`);
        });
        unregisterAuthObserver = firebase.auth().onAuthStateChanged(
          (user) => {
            console.log(user);
          }
        );
      }
      return () => {
        unregisterAuthObserver();
      }
    });
    return (
      <>
        <Head>
          <title>Floor Plan Editor</title>
          <link rel='shortcut icon' type='image/x-icon' href='/static/favicon.ico' />
          <link rel="manifest" href="/static/manifest.json" />
          <meta name="theme-color" content="#F3F7FA" />
          <meta
            name="description"
            content="Floor Plan Editor will help you to plan your apartments"
          />
          <link href="https://fonts.googleapis.com/css?family=Open+Sans:400,600&display=swap" rel="stylesheet"></link>
        </Head>
        <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()}/>
  
        {React.createElement(Page)}
        
        <style global jsx>{`
          body {
            position: fixed;
            margin: 0;
            font-family: 'Open Sans', -apple-system, BlinkMacSystemFont, Helvetica, sans-serif;
            background-color: #F3F7FA;
            color: #4A4A4A;
            max-width: 100vw;
            max-height: calc(var(--vh, 1vh) * 100);
            min-width: 100vw;
            min-height: calc(var(--vh, 1vh) * 100);
            overflow: hidden;
          }
        `}</style>
      </>
    );
  }

  Root.getInitialProps = async ({ req }) => {
    return {
      init: true,
    };
  }

  return provider(
    ...services,
  )(Root);
}
