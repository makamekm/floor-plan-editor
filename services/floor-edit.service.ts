import { observable } from "mobx";
import { IRootService } from "./root-sevice.interface";
import { useRouterChange } from "../utils/router-hook";

export class FloorEditService implements IRootService {
  @observable opened = false;

  useHook() {
    useRouterChange(this.onRouterChange);
  }

  onRouterChange = () => {
    this.opened = false;
  }
}