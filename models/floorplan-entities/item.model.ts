import { FloorplanModel } from "../floorplan-model";
import { FloorplanView } from "../floorplan-view";

export interface ItemMetadata {
  id?: number;
  name: string;
  description: string;
  type: number;
}

export abstract class Item {

  /** Constructs an item. 
   * @param floorplan The associated floorplan.
   * @param x X coordinate.
   * @param y Y coordinate.
   */
  constructor(
    private floorplan: FloorplanModel,
    public x: number,
    public y: number,
    public r: number,
    public metadata: ItemMetadata,
  ) {
    
  }

  /** Reset the state */
  public abstract startActive(): void;

  /** Reset the state */
  public abstract endActive(): void;

  /** Reset the state */
  public abstract mousedown(x: number, y: number): void;

  /** Reset the state */
  public abstract mouseup(x: number, y: number): void;

  /** Reset the state */
  public abstract mousemove(
    mouseX: number, mouseY: number,
    lastMouseX: number, lastMouseY: number,
  ): boolean | void;

  public abstract render(
    x: number,
    y: number,
    hover: boolean,
    selected: boolean,
    view: FloorplanView,
  ): void;

  public abstract overlapped(
    x: number,
    y: number,
    selected: boolean,
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
    this.r = r;
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
    this.rotate(this.r + dr * 180 / Math.PI);
  }
}