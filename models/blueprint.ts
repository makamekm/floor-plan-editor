import { Model } from "./model";
import { Floorplanner } from "./floorplanner";
import { floorplannerModes } from "./floorplanner-view";
import { Callback } from "../utils/callback";

/** Blueprint core application. */
export class Blueprint {
  
  private model: Model;
  private floorplanner: Floorplanner;

  public onModeChange = new Callback<string>();

  /** Creates an instance.
   */
  constructor(canvasId: string) {
    this.model = new Model();
    this.floorplanner = new Floorplanner(canvasId, this.model.getFloorplan());

    this.floorplanner.onModeChange.add(mode => {
      switch (mode) {
        case floorplannerModes.MOVE:
          this.onModeChange.fire('move');
          break;
        case floorplannerModes.DRAW:
          this.onModeChange.fire('draw');
          break;
        case floorplannerModes.DELETE:
          this.onModeChange.fire('delete');
          break;
      }
    });
  }

  public load(floorplan: string) {
    this.model.loadSerialized(floorplan);
  }

  public export(): string {
    return this.model.exportSerialized();
  }

  public changeMode(mode: string) {
    switch (mode) {
      case 'move':
        this.floorplanner.setMode(floorplannerModes.MOVE);
        break;
      case 'draw':
        this.floorplanner.setMode(floorplannerModes.DRAW);
        break;
      case 'delete':
        this.floorplanner.setMode(floorplannerModes.DELETE);
        break;
    }
  }
}