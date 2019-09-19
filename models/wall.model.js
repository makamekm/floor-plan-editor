import { getNumericValue, configWallThickness, configWallHeight } from "../utils/configuration";
import { pointDistanceFromLine } from "../utils/operations";

const defaultWallTexture = {
  url: "rooms/textures/wallmap.png",
  stretch: true,
  scale: 0
}

/** 
 * A Wall is the basic element to create Rooms.
 * 
 * Walls consists of two half edges.
 */
export class Wall {

  /** The unique id of each wall. */
  id;

  /** Front is the plane from start to end. */
  frontEdge = null;

  /** Back is the plane from end to start. */
  backEdge = null;

  /** */
  orphan = false;

  /** Items attached to this wall */
  items = [];

  /** */
  onItems = [];

  /** The front-side texture. */
  frontTexture = defaultWallTexture;

  /** The back-side texture. */
  backTexture = defaultWallTexture;

  /** Wall thickness. */
  thickness = getNumericValue(configWallThickness);

  /** Wall height. */
  height = getNumericValue(configWallHeight);

  /** Actions to be applied after movement. */
  moved_callbacks = $.Callbacks();

  /** Actions to be applied on removal. */
  deleted_callbacks = $.Callbacks();

  /** Actions to be applied explicitly. */
  action_callbacks = $.Callbacks();

  start;
  end;

  /** 
   * Constructs a new wall.
   * @param start Start corner.
   * @param end End corner.
   */
  constructor(start, end) {
    this.start = start;
    this.end = end;

    this.id = this.getUuid();

    this.start.attachStart(this)
    this.end.attachEnd(this);
  }

  getUuid() {
    return [this.start.id, this.end.id].join();
  }

  resetFrontBack() {
    this.frontEdge = null;
    this.backEdge = null;
    this.orphan = false;
  }

  snapToAxis(tolerance) {
    // order here is important, but unfortunately arbitrary
    this.start.snapToAxis(tolerance);
    this.end.snapToAxis(tolerance);
  }

  fireOnMove(func) {
    this.moved_callbacks.add(func);
  }

  fireOnDelete(func) {
    this.deleted_callbacks.add(func);
  }

  dontFireOnDelete(func) {
    this.deleted_callbacks.remove(func);
  }

  fireOnAction(func) {
    this.action_callbacks.add(func)
  }

  fireAction(action) {
    this.action_callbacks.fire(action)
  }

  relativeMove(dx, dy) {
    this.start.relativeMove(dx, dy);
    this.end.relativeMove(dx, dy);
  }

  fireMoved() {
    this.moved_callbacks.fire();
  }

  fireRedraw() {
    if (this.frontEdge) {
      this.frontEdge.redrawCallbacks.fire();
    }
    if (this.backEdge) {
      this.backEdge.redrawCallbacks.fire();
    }
  }

  getStart() {
    return this.start;
  }

  getEnd() {
    return this.end;
  }

  getStartX() {
    return this.start.getX();
  }

  getEndX() {
    return this.end.getX();
  }

  getStartY() {
    return this.start.getY();
  }

  getEndY() {
    return this.end.getY();
  }

  remove() {
    this.start.detachWall(this);
    this.end.detachWall(this);
    this.deleted_callbacks.fire(this);
  }

  setStart(corner) {
    this.start.detachWall(this);
    corner.attachStart(this);
    this.start = corner;
    this.fireMoved();
  }

  setEnd(corner) {
    this.end.detachWall(this);
    corner.attachEnd(this);
    this.end = corner;
    this.fireMoved();
  }

  distanceFrom(x, y) {
    return pointDistanceFromLine(
      x, y,
      this.getStartX(), this.getStartY(),
      this.getEndX(), this.getEndY(),
    );
  }

  /** Return the corner opposite of the one provided.
   * @param corner The given corner.
   * @returns The opposite corner.
   */
  oppositeCorner(corner) {
    if (this.start === corner) {
      return this.end;
    } else if (this.end === corner) {
      return this.start;
    } else {
      console.log('Wall does not connect to corner');
    }
  }
}