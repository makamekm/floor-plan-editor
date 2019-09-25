import { FloorplanController } from "./floorplan-controller";
import { Callback } from "../utils/callback";
import { FloorplanDto } from "./floor.dto";
import { FloorplanMode } from "./floorplan-mode.enum";
import { ItemEnum } from "./floorplan-entities/item.enum";
import { FloorplanModel } from "./floorplan-model";
import { Utils } from "../utils/operations";

/** Blueprint core application. */
export class Blueprint {

  private floorplanner: FloorplanController;
  private floorplan: FloorplanModel;

  public onModeChange = new Callback<string>();
  public onSelectedItemChange = new Callback<number>();
  public onModelChange = new Callback<{
    floorplan: FloorplanDto;
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

    this.floorplanner.onModelChange.add(model => {
      this.onModelChange.fire(model);
    });

    this.floorplan.onSelectedItemChange.add(index => {
      this.onSelectedItemChange.fire(index);
    });
  }

  public setState(floorplan: FloorplanDto, x: number, y: number, selectedItem: number | null) {
    this.floorplan.reset();
    this.floorplanner.originX = x;
    this.floorplanner.originY = y;
    this.floorplan.loadFloorplan(floorplan, false);
    this.floorplan.setSelectedItem(selectedItem != null ? this.floorplan.getItems()[selectedItem] : null);
    this.floorplanner.draw();
  }

  public load(floorplan: FloorplanDto) {
    this.floorplan.loadFloorplan(floorplan);
    return this.floorplanner.getModel();
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
      case 'read':
        this.floorplanner.setMode(null);
        break;
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
      {
        id: Utils.guid(),
        description: '',
        name: '',
        type,
        r: 0,
      }
    );
    this.floorplanner.fireChanges();
    this.floorplanner.draw();
  }
}