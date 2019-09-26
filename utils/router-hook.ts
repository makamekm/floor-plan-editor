import { useEffect } from "react";
import { Router } from "next/router";

export function useRouterChange(onRouterChange: () => void) {
  useEffect(() => {
    onRouterChange();
    Router.events.on("routeChangeComplete", onRouterChange);
    return () => {
      Router.events.off("routeChangeComplete", onRouterChange);
    };
  }, []);
}