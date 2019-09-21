import { FloorplanController } from "./floorplan-controller";
import { Callback } from "../utils/callback";
import { FloorplanDto } from "./floor.dto";
import { FloorplanMode } from "./floorplan-mode.enum";
import { ItemEnum } from "./floorplan-entities/item.enum";
import { FloorplanModel } from "./floorplan-model";

/** Blueprint core application. */
export class Blueprint {

  private floorplanner: FloorplanController;
  private floorplan: FloorplanModel;

  public onModeChange = new Callback<string>();
  public onModelChange = new Callback<{
    floorplane: FloorplanDto;
    x: number;
    y: number;
  }>();

  /** Creates an instance.
   */
  constructor(canvas: HTMLCanvasElement) {
    this.floorplan = new FloorplanModel();
    this.floorplanner = new FloorplanController(canvas, this.floorplan);

    this.floorplanner.onModeChange.add(mode => {
      switch (mode) {
        case FloorplanMode.MOVE:
          this.onModeChange.fire('move');
          break;
        case FloorplanMode.DRAW:
          this.onModeChange.fire('draw');
          break;
        case FloorplanMode.DELETE:
          this.onModeChange.fire('delete');
          break;
      }
    });
  }

  public load(floorplan: FloorplanDto) {
    this.floorplan.loadFloorplan(floorplan);
  }

  public export(): FloorplanDto {
    return this.floorplan.exportFloorplan();
  }

  public reset() {
    this.floorplan.reset();
    this.floorplanner.reset();
  }

  public changeMode(mode: string) {
    switch (mode) {
      case 'move':
        this.floorplanner.setMode(FloorplanMode.MOVE);
        break;
      case 'draw':
        this.floorplanner.setMode(FloorplanMode.DRAW);
        break;
      case 'delete':
        this.floorplanner.setMode(FloorplanMode.DELETE);
        break;
    }
  }

  public addItem(type: ItemEnum) {
    const { x, y } = this.floorplanner.getCenter();
    this.floorplan.newItem(
      x,
      y,
      0,
      {
        description: '',
        name: '',
        type,
      }
    );
  }
}