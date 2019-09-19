import { Model } from "./model";
import { Floorplanner } from "./floorplanner";

/** Blueprint core application. */
export class Blueprint {
  
  private model: Model;
  private floorplanner: Floorplanner;

  /** Creates an instance.
   */
  constructor(canvasId: string) {
    this.model = new Model();
    this.floorplanner = new Floorplanner(canvasId, this.model.getFloorplan());
  }

  public load(floorplan: string) {
    this.model.loadSerialized(floorplan);
  }

  public export(): string {
    return this.model.exportSerialized();
  }
}