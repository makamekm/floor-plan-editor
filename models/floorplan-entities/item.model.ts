import { FloorplanMode } from "../floorplan-mode.enum";
import { FloorplanModel } from "../floorplan-model";
import { FloorplanView } from "../floorplan-view";

export interface ItemMetadata {
  id: number | string;
  name: string;
  description: string;
  r: number;
  type: number;
  height: number;
  width: number;
}

export abstract class Item {

  /** Constructs an item.
   * @param floorplan The associated floorplan.
   * @param x X coordinate.
   * @param y Y coordinate.
   * @param metadata specific item data.
   */
  constructor(
    private floorplan: FloorplanModel,
    public x: number,
    public y: number,
    public metadata: ItemMetadata,
  ) {
    this.x = this.x || 0;
    this.y = this.y || 0;
    this.metadata.name = this.metadata.name || "";
    this.metadata.description = this.metadata.description || "";
    this.metadata.height = this.metadata.height || 0;
    this.metadata.width = this.metadata.width || 0;
  }

  /** Reset the state */
  public abstract startActive(): void;

  /** Reset the state */
  public abstract endActive(): void;

  /** Reset the state */
  public abstract mousedown(x: number, y: number, scale: number, mode: FloorplanMode): void;

  /** Reset the state */
  public abstract mouseup(x: number, y: number, scale: number, mode: FloorplanMode): boolean | void;

  /** Reset the state */
  public abstract mousemove(
    mouseX: number, mouseY: number,
    lastMouseX: number, lastMouseY: number,
    mode: FloorplanMode,
  ): boolean | void;

  public abstract render(
    x: number,
    y: number,
    scale: number,
    hover: boolean,
    selected: boolean,
    mode: FloorplanMode,
    view: FloorplanView,
  ): void;

  public abstract overlapped(
    x: number,
    y: number,
    scale: number,
    selected: boolean,
    mode: FloorplanMode,
  ): boolean;

  /** Remove callback. Fires the delete callbacks. */
  public remove() {
    this.floorplan.removeItem(this);
  }

  /** Moves item to new position.
   * @param newX The new x position.
   * @param newY The new y position.
   */
  public move(newX: number, newY: number) {
    this.x = newX;
    this.y = newY;
  }

  /** Rotates item to new angle.
   * @param r The new r angle.
   */
  public rotate(r: number) {
    this.metadata.r = r;
  }

  /** Moves item relatively to new position.
   * @param dx The delta x.
   * @param dy The delta y.
   */
  public relativeMove(dx: number, dy: number) {
    this.move(this.x + dx, this.y + dy);
  }

  /** Moves item relatively to new angle.
   * @param dr The delta r.
   */
  public relativeRotate(dr: number) {
    this.rotate(this.metadata.r + dr * 180 / Math.PI);
  }
}
