import React from 'react'
import Head from 'next/head'
import { provider, useInstances } from 'react-ioc'
import { FloorProvider } from "../services/floor.provider";
import { FloorService } from "../services/floor.service";
import { BlueprintService } from "../services/blueprint.service";
import { FloorListService } from "../services/floor-list.service";
import { FloorEditService } from '../services/floor-edit.service';

const services = [
  FloorProvider,
  FloorService,
  FloorListService,
  BlueprintService,
  FloorEditService,
];

export default (Page) => {
  const Root = () => {
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
            max-height: 100vh;
            min-width: 100vw;
            min-height: 100vh;
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
