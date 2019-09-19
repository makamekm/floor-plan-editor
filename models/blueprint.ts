import { Model } from "./model";
import { Floorplanner } from "./floorplanner";
import { FloorplannerMode } from "./floorplanner-view";
import { Callback } from "../utils/callback";

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


    this.load(JSON.stringify(demoPlan));
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