import { Floorplan } from "./floorplan";
import { FloorplanDto } from "./floor.dto";

export interface IItemExport {
  item_name: string;
  item_type: number;
  model_url: string;
  xpos: number;
  ypos: number;
  zpos: number;
  rotation: number;
  scale_x: number;
  scale_y: number;
  scale_z: number;
  fixed: boolean;
  resizable: boolean;
}

/** 
 * A Model connects a Floorplan and a Scene. 
 */
export class Model {

  private floorplan: Floorplan;

  public getFloorplan() {
    return this.floorplan;
  };

  /** Constructs a new model.
   */
  constructor() {
    this.floorplan = new Floorplan();
  }

  public export() {
    return this.floorplan.exportFloorplan();
  }

  public load(floorplan: FloorplanDto) {
    this.floorplan.loadFloorplan(floorplan);
  }

  public reset() {
    this.floorplan.reset();
  }
}
