import { observable } from "mobx";
import { useRouterChange } from "../utils/router-hook";
import { IRootService } from "./root-sevice.interface";

export class FloorEditService implements IRootService {
  @observable public opened = false;

  public useHook() {
    useRouterChange(this.onRouterChange);
  }

  public onRouterChange = () => {
    this.opened = false;
  }
}
