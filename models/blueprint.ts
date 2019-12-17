import { Callback } from '../utils/callback';
import { Utils } from '../utils/operations';
import { FloorplanDto } from './floor.dto';
import { FloorplanController } from './floorplan-controller';
import { ItemEnum } from './floorplan-entities/item.enum';
import { FloorplanMode } from './floorplan-mode.enum';
import { FloorplanModel } from './floorplan-model';

/** Blueprint core application. */
export class Blueprint {
  public onModeChange = new Callback<string>();
  public onSelectedItemChange = new Callback<number>();
  public onModelChange = new Callback<{
    floorplan: FloorplanDto;
    x: number;
    y: number;
  }>();

  private floorplanner: FloorplanController;
  private floorplan: FloorplanModel;

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

  public setState(
    floorplan: FloorplanDto,
    selectedItem: number | null,
    x?: number,
    y?: number
  ) {
    this.floorplan.reset();
    if (x) {
      this.floorplanner.originX = x;
    }
    if (y) {
      this.floorplanner.originY = y;
    }
    this.floorplan.loadFloorplan(floorplan, false);
    this.floorplan.setSelectedItem(
      selectedItem != null ? this.floorplan.getItems()[selectedItem] : null
    );
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

  public changeMode(mode: string, isWallLocked?: boolean) {
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
      case 'lock':
        this.floorplanner.changeIsWallLocked(isWallLocked);
        break;
    }
  }

  public setDemoMode(value: boolean) {
    this.floorplan.setDemoMode(value);
    this.floorplanner.draw();
  }

  public addItem(type: ItemEnum) {
    const { x, y } = this.floorplanner.getCenter();
    this.floorplan.newItem(x, y, {
      id: Utils.guid(),
      description: '',
      name: '',
      type,
      r: 0,
      height: 0,
      width: 0
    });
    this.floorplanner.fireChanges();
    this.floorplanner.draw();
  }
}
