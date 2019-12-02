import debounce from "debounce";
import { observable } from "mobx";
import { NextRouter, useRouter } from "next/router";
import { useEffect } from "react";
import { useRouterChange, useRouterChangeStart } from "../utils/router-hook";
import { IRootService } from "./root-sevice.interface";

export class FloorRouterService implements IRootService {

  @observable public loading: boolean = false;

  private setLoading = debounce<(value: boolean) => void>((value) => {
    this.loading = value;
  }, 500);

  private router: NextRouter;

  public useHook() {
    this.router = useRouter();
    useRouterChange(this.onRouterChange);
    useRouterChangeStart(this.onRouterChangeStart);
    useEffect(() => {
      window.onbeforeunload = () => {
        this.loading = true;
      };
    }, []);
  }

  public async openHome() {
    this.router.push("/");
  }

  public async openFloor(id: number | string) {
    this.router.push("/[id]", "/" + String(id));
  }

  private onRouterChangeStart = () => {
    this.loading = true;
  }

  private onRouterChange = () => {
    this.setLoading(false);
  }
}
