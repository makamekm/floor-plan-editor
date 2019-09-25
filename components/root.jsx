import React from 'react'
import Head from 'next/head'
import { provider, useInstances } from 'react-ioc'
import { UserService } from '../services/user.service';
import { FloorProvider } from '../services/floor.provider';
import { ProjectListService } from "../services/project-list.service";
import { ProjectService } from '../services/project.service';
import { FloorListService } from "../services/floor-list.service";
import { FloorService } from "../services/floor.service";
import { BlueprintService } from "../services/blueprint.service";
import { FloorEditService } from '../services/floor-edit.service';

const services = [
  UserService,
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
    React.useEffect(() => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
      window.addEventListener('resize', () => {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
      });
    }, []);

    useInstances(...services);

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
