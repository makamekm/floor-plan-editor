import { Configuration, configWallThickness } from "../../utils/configuration";
import { Utils } from "../../utils/operations";
import { FloorplanModel } from "../floorplan-model";
import { Corner } from "./corner.model";
import { HalfEdge } from "./half-edge.model";

/**
 * A Wall is the basic element to create Rooms.
 *
 * Walls consists of two half edges.
 */
export class Wall {

  /** Front is the plane from start to end. */
  public frontEdge: HalfEdge | null = null;

  /** Back is the plane from end to start. */
  public backEdge: HalfEdge | null = null;

  public orphan = false;

  /** Wall thickness. */
  public thickness = Configuration.getNumericValue(configWallThickness);

  /** The unique id of each wall. */
  private id: string;

  /**
   * Constructs a new wall.
   * @param start Start corner.
   * @param end End corner.
   */
  constructor(private floorplan: FloorplanModel, private start: Corner, private end: Corner) {
    this.id = this.getUuid();

    this.start.attachStart(this);
    this.end.attachEnd(this);
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

  public relativeMove(dx: number, dy: number) {
    this.start.relativeMove(dx, dy);
    this.end.relativeMove(dx, dy);
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
    return this.start.x;
  }

  public getEndX(): number {
    return this.end.x;
  }

  public getStartY(): number {
    return this.start.y;
  }

  public getEndY(): number {
    return this.end.y;
  }

  public remove() {
    this.start.detachWall(this);
    this.end.detachWall(this);
    this.floorplan.removeWall(this);
  }

  public setStart(corner: Corner) {
    this.start.detachWall(this);
    corner.attachStart(this);
    this.start = corner;
  }

  public setEnd(corner: Corner) {
    this.end.detachWall(this);
    corner.attachEnd(this);
    this.end = corner;
  }

  public distanceFrom(x: number, y: number, scale: number): number {
    return Utils.pointDistanceFromLine(
      x, y,
      this.getStartX() / scale, this.getStartY() / scale,
      this.getEndX() / scale, this.getEndY()/ scale,
    );
  }

  private getUuid(): string {
    return [this.start.id, this.end.id].join();
  }
}
