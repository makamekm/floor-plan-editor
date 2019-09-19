import { HalfEdge } from "./half-edge";
import { Configuration, configWallThickness } from "../utils/configuration";
import { Corner } from "./corner";
import { Callback } from "../utils/callback";
import { Utils } from "../utils/operations";

/** 
 * A Wall is the basic element to create Rooms.
 * 
 * Walls consists of two half edges.
 */
export class Wall {

  /** The unique id of each wall. */
  private id: string;

  /** Front is the plane from start to end. */
  public frontEdge: HalfEdge | null = null;

  /** Back is the plane from end to start. */
  public backEdge: HalfEdge | null = null;

  /** */
  public orphan = false;

  /** Wall thickness. */
  public thickness = Configuration.getNumericValue(configWallThickness);

  /** Actions to be applied after movement. */
  private moved_callbacks = new Callback();

  /** Actions to be applied on removal. */
  private deleted_callbacks = new Callback<Wall>();

  /** Actions to be applied explicitly. */
  private action_callbacks = new Callback<() => void>();

  /** 
   * Constructs a new wall.
   * @param start Start corner.
   * @param end End corner.
   */
  constructor(private start: Corner, private end: Corner) {
    this.id = this.getUuid();

    this.start.attachStart(this)
    this.end.attachEnd(this);
  }

  private getUuid(): string {
    return [this.start.id, this.end.id].join();
  }

  public resetFrontBack() {
    this.frontEdge = null;
    this.backEdge = null;
    this.orphan = false;
  }

  public snapToAxis(tolerance: number) {
    // order here is important, but unfortunately arbitrary
    this.start.snapToAxis(tolerance);
    this.end.snapToAxis(tolerance);
  }

  public fireOnMove(func: () => void) {
    this.moved_callbacks.add(func);
  }

  public fireOnDelete(func: () => void) {
    this.deleted_callbacks.add(func);
  }

  public dontFireOnDelete(func: () => void) {
    this.deleted_callbacks.remove(func);
  }

  public fireOnAction(func: () => void) {
    this.action_callbacks.add(func)
  }

  public fireAction(action: () => void) {
    this.action_callbacks.fire(action);
  }

  public relativeMove(dx: number, dy: number) {
    this.start.relativeMove(dx, dy);
    this.end.relativeMove(dx, dy);
  }

  public fireMoved() {
    this.moved_callbacks.fire();
  }

  public fireRedraw() {
    if (this.frontEdge) {
      this.frontEdge.redrawCallbacks.fire();
    }
    if (this.backEdge) {
      this.backEdge.redrawCallbacks.fire();
    }
  }

  public getStart(): Corner {
    return this.start;
  }

  public getEnd(): Corner {
    return this.end;
  }

  public getStartX(): number {
    return this.start.getX();
  }

  public getEndX(): number {
    return this.end.getX();
  }

  public getStartY(): number {
    return this.start.getY();
  }

  public getEndY(): number {
    return this.end.getY();
  }

  public remove() {
    this.start.detachWall(this);
    this.end.detachWall(this);
    this.deleted_callbacks.fire(this);
  }

  public setStart(corner: Corner) {
    this.start.detachWall(this);
    corner.attachStart(this);
    this.start = corner;
    this.fireMoved();
  }

  public setEnd(corner: Corner) {
    this.end.detachWall(this);
    corner.attachEnd(this);
    this.end = corner;
    this.fireMoved();
  }

  public distanceFrom(x: number, y: number): number {
    return Utils.pointDistanceFromLine(
      x, y,
      this.getStartX(), this.getStartY(),
      this.getEndX(), this.getEndY()
    );
  }
}
