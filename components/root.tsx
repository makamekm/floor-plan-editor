import { observer } from "mobx-react";
import Head from "next/head";
import React from "react";
import { provider, useInstances } from "react-ioc";
import { FloorRouterService } from "../services/floor-router.service";
import { BlueprintService } from "../services/blueprint.service";
import { FloorEditService } from "../services/floor-edit.service";
import { FloorListService } from "../services/floor-list.service";
import { FloorProvider } from "../services/floor.provider";
import { FloorService } from "../services/floor.service";
import { ProjectListService } from "../services/project-list.service";
import { ProjectService } from "../services/project.service";
import { IRootService } from "../services/root-sevice.interface";
import { UserService } from "../services/user.service";
import Loading from "./loading";

const services: Array<
  (new () => IRootService) | (new () => object)
> = [
  BlueprintService,
  UserService,
  FloorRouterService,
  FloorProvider,
  FloorListService,
  ProjectListService,
  ProjectService,
  FloorService,
  FloorEditService,
];

const updateVH = () => {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty("--vh", `${vh}px`);
};

const Root = ({
  children,
  ...props
}: {
  children: any;
}) => {
  React.useEffect(() => {
    updateVH();
    window.addEventListener("resize", updateVH);
    return () => window.removeEventListener("resize", updateVH);
  }, []);

  const instances: IRootService[] = (useInstances as any)(...services); // monkey patch

  let loading = false;

  instances.forEach((instance) => {
    if (instance.useHook) {
      instance.useHook(props);
      loading = loading || instance.loading;
    }
  });

  return (
    <>
      <Head>
        <title>Floor Plan Editor</title>
        <link rel="shortcut icon" type="image/x-icon" href="/static/favicon.ico" />
        <link rel="manifest" href="/static/manifest.json" />
        <meta name="theme-color" content="#F3F7FA" />
        <meta
          name="description"
          content="Floor Plan Editor will help you to plan your apartments"
        />
        <link href="https://fonts.googleapis.com/css?family=Open+Sans:400,600&display=swap" rel="stylesheet"></link>
      </Head>

      {children}

      <Loading active={loading}></Loading>

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
};

export default provider(
  ...services,
)(observer(Root));
