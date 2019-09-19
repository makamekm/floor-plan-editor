import { Floorplan } from "./floorplan";

const demoPlan = {
  "corners": {
    "f90da5e3-9e0e-eba7-173d-eb0b071e838e": {
      "x": 300,
      "y": 300
    },
    "da026c08-d76a-a944-8e7b-096b752da9ed": {
      "x": 600,
      "y": 300
    },
    "4e3d65cb-54c0-0681-28bf-bddcc7bdb571": {
      "x": 600,
      "y": 600
    },
    "71d4f128-ae80-3d58-9bd2-711c6ce6cdf2": {
      "x": 300,
      "y": 600
    }
  },
  "walls": [
    {
      "corner1": "71d4f128-ae80-3d58-9bd2-711c6ce6cdf2",
      "corner2": "f90da5e3-9e0e-eba7-173d-eb0b071e838e"
    },
    {
      "corner1": "f90da5e3-9e0e-eba7-173d-eb0b071e838e",
      "corner2": "da026c08-d76a-a944-8e7b-096b752da9ed"
    },
    {
      "corner1": "da026c08-d76a-a944-8e7b-096b752da9ed",
      "corner2": "4e3d65cb-54c0-0681-28bf-bddcc7bdb571"
    },
    {
      "corner1": "4e3d65cb-54c0-0681-28bf-bddcc7bdb571",
      "corner2": "71d4f128-ae80-3d58-9bd2-711c6ce6cdf2"
    }
  ]
};

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

  /** */
  private floorplan: Floorplan;

  /** */
  public getFloorplan() {
    return this.floorplan;
  };

  /** Constructs a new model.
   */
  constructor() {
    this.floorplan = new Floorplan();
    this.loadSerialized(JSON.stringify(demoPlan));
  }

  public exportSerialized(): string {
    const floorplan = this.floorplan.exportFloorplan();
    return JSON.stringify(floorplan);
  }

  public loadSerialized(floorplan: string) {
    this.floorplan.loadFloorplan(JSON.parse(floorplan));
  }
}
