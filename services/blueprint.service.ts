import { Router } from "next/router";
import { Blueprint } from "../models/blueprint";
import { observable } from "mobx";
import { FloorplanDto } from "../models/floor.dto";

export class BlueprintService {
  @observable public mode: string = 'move';
  private blueprint: Blueprint;
  
  public setBlueprint(blueprint: Blueprint) {
    this.blueprint = blueprint;
    this.attachListeners();
  }

  public setFloorplan(floorplan: FloorplanDto) {
    this.blueprint.load(floorplan);
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