import { inject } from "react-ioc";
import { FloorService } from "./floor.service";
import { Router } from "next/router";
import { Blueprint } from "../models/blueprint";
import { observable } from "mobx";

export class BlueprintService {
  @observable public mode: string = 'move';
  @inject(FloorService) private floorService: FloorService;
  private blueprint: Blueprint;
  
  public setBlueprint(blueprint: Blueprint) {
    this.blueprint = blueprint;
    this.attachListeners();
  }
  
  public usnsetBlueprint(blueprint: Blueprint) {
    if (this.blueprint) {
      this.detachListeners();
    }
    this.blueprint = null;
  }

  private onModeChange = (mode: string) => {
    this.mode = mode;
  };

  private attachListeners() {
    this.blueprint.onModeChange.add(this.onModeChange);
  }

  private detachListeners() {
    this.blueprint.onModeChange.remove(this.onModeChange);
  }

  public changeMode(mode: string) {
    this.blueprint.changeMode(mode);
  }

  constructor() {
    Router.events.on("routeChangeComplete", (url) => {
      if (this.blueprint) {
        this.blueprint.reset();
      }
    });
  }

}