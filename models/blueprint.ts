import { Model } from "./model";
import { Floorplanner } from "./floorplanner";
import { FloorplannerMode } from "./floorplanner-view";
import { Callback } from "../utils/callback";

/** Blueprint core application. */
export class Blueprint {
  
  private model: Model;
  private floorplanner: Floorplanner;

  public onModeChange = new Callback<string>();

  /** Creates an instance.
   */
  constructor(canvas: HTMLCanvasElement) {
    this.model = new Model();
    this.floorplanner = new Floorplanner(canvas, this.model.getFloorplan());

    this.floorplanner.onModeChange.add(mode => {
      switch (mode) {
        case FloorplannerMode.MOVE:
          this.onModeChange.fire('move');
          break;
        case FloorplannerMode.DRAW:
          this.onModeChange.fire('draw');
          break;
        case FloorplannerMode.DELETE:
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
        this.floorplanner.setMode(FloorplannerMode.MOVE);
        break;
      case 'draw':
        this.floorplanner.setMode(FloorplannerMode.DRAW);
        break;
      case 'delete':
        this.floorplanner.setMode(FloorplannerMode.DELETE);
        break;
    }
  }
}