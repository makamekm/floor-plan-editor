import { Model } from "./model";
import { Floorplanner } from "./floorplanner";
import { Callback } from "../utils/callback";
import { FloorplanDto } from "./floor.dto";
import { FloorplannerMode } from "./floorplanner-mode.enum";
import { ItemEnum } from "./item.enum";

/** Blueprint core application. */
export class Blueprint {
  
  private model: Model;
  private floorplanner: Floorplanner;

  public onModeChange = new Callback<string>();
  public onModelChange = new Callback<{
    floorplane: FloorplanDto;
    x: number;
    y: number;
  }>();

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

  public load(floorplan: FloorplanDto) {
    this.model.load(floorplan);
  }

  public export(): FloorplanDto {
    return this.model.export();
  }

  public reset() {
    this.model.reset();
    this.floorplanner.reset();
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

  public addItem(type: ItemEnum) {
    const { x, y } = this.floorplanner.getCenter();
    this.model.getFloorplan().newItem(
      x,
      y,
      {
        description: '',
        name: '',
        type,
      }
    );
  }
}