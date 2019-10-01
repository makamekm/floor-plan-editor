import { Router } from "next/router";
import { useEffect } from "react";

export function useRouterChange(onRouterChange: () => void) {
  useEffect(() => {
    onRouterChange();
    Router.events.on("routeChangeComplete", onRouterChange);
    return () => {
      Router.events.off("routeChangeComplete", onRouterChange);
    };
  }, []);
}

export function useRouterChangeStart(onRouterChange: () => void) {
  useEffect(() => {
    onRouterChange();
    Router.events.on("routeChangeStart", onRouterChange);
    return () => {
      Router.events.off("routeChangeStart", onRouterChange);
    };
  }, []);
}
