import { Matrix4, Mesh, Vector3, Face3, Geometry, MeshBasicMaterial, Vector2 } from "three";
import { Callback } from "../utils/callback";
import { Wall } from "./wall";
import { Utils } from "../utils/operations";

/**
 * Half Edges are created by Room.
 * 
 * Once rooms have been identified, Half Edges are created for each interior wall.
 * 
 * A wall can have two half edges if it is visible from both sides.
 */
export class HalfEdge {

  /** The successor edge in CCW ??? direction. */
  public next: HalfEdge | null = null;

  /** The predecessor edge in CCW ??? direction. */
  public prev: HalfEdge | null = null;

  /** */
  public offset: number;

  /** */
  public height: number;

  /** used for intersection testing... not convinced this belongs here */
  public plane: Mesh | null = null;

  /** transform from world coords to wall planes (z=0) */
  public interiorTransform = new Matrix4();

  /** transform from world coords to wall planes (z=0) */
  public invInteriorTransform = new Matrix4();

  /** transform from world coords to wall planes (z=0) */
  private exteriorTransform = new Matrix4();

  /** transform from world coords to wall planes (z=0) */
  private invExteriorTransform = new Matrix4();

  /** */
  public redrawCallbacks = new Callback();

  /**
   * Constructs a half edge.
   * @param room The associated room.
   * @param wall The corresponding wall.
   * @param front True if front side.
   */
  constructor(public wall: Wall, private front: boolean) {
    this.front = front || false;

    this.offset = wall.thickness / 2.0;

    if (this.front) {
      this.wall.frontEdge = this;
    } else {
      this.wall.backEdge = this;
    }
  }

  private transformCorner(corner: Vector2) {
    return new Vector3(corner.x, 0, corner.y);
  }

  /** 
   * this feels hacky, but need wall items
   */
  public generatePlane() {

    const v1 = this.transformCorner(this.interiorStart());
    const v2 = this.transformCorner(this.interiorEnd());
    const v3 = v2.clone();
    const v4 = v1.clone();

    const geometry = new Geometry();
    geometry.vertices = [v1, v2, v3, v4];

    geometry.faces.push(new Face3(0, 1, 2));
    geometry.faces.push(new Face3(0, 2, 3));
    geometry.computeFaceNormals();
    geometry.computeBoundingBox();

    this.plane = new Mesh(
      geometry,
      new MeshBasicMaterial(),
    );
    this.plane.visible = false;
    (<any>this.plane).edge = this; // js monkey patch

    this.computeTransforms(
      this.interiorTransform, this.invInteriorTransform,
      this.interiorStart(), this.interiorEnd());
    this.computeTransforms(
      this.exteriorTransform, this.invExteriorTransform,
      this.exteriorStart(), this.exteriorEnd());
  }

  public interiorDistance(): number {
    const start = this.interiorStart();
    const end = this.interiorEnd();
    return Utils.distance(start.x, start.y, end.x, end.y);
  }

  private computeTransforms(transform: Matrix4, invTransform: Matrix4, start: Vector2, end: Vector2) {
    const v1 = start;
    const v2 = end;

    const angle = Utils.angle(1, 0, v2.x - v1.x, v2.y - v1.y);

    const tt = new Matrix4();
    tt.makeTranslation(-v1.x, 0, -v1.y);
    const tr = new Matrix4();
    tr.makeRotationY(-angle);
    transform.multiplyMatrices(tr, tt);
    invTransform.getInverse(transform);
  }

  /** Gets the distance from specified point.
   * @param x X coordinate of the point.
   * @param y Y coordinate of the point.
   * @returns The distance.
   */
  public distanceTo(x: number, y: number): number {
    // x, y, x1, y1, x2, y2
    return Utils.pointDistanceFromLine(x, y,
      this.interiorStart().x,
      this.interiorStart().y,
      this.interiorEnd().x,
      this.interiorEnd().y);
  }

  private getStart() {
    if (this.front) {
      return this.wall.getStart();
    } else {
      return this.wall.getEnd();
    }
  }

  private getEnd() {
    if (this.front) {
      return this.wall.getEnd();
    } else {
      return this.wall.getStart();
    }
  }

  // these return an object with attributes x, y
  public interiorEnd(): Vector2 {
    if (this.next != null) {
      const vec = this.halfAngleVector(this, this.next);
      return new Vector2(
        this.getEnd().x + vec.x,
        this.getEnd().y + vec.y
      )
    } else {
      return new Vector2(
        this.getEnd().x,
        this.getEnd().y
      )
    }
  }

  public interiorStart(): Vector2 {
    if (this.prev != null) {
      const vec = this.halfAngleVector(this.prev, this);
      return new Vector2(
        this.getStart().x + vec.x,
        this.getStart().y + vec.y
      );
    } else {
      return new Vector2(
        this.getStart().x,
        this.getStart().y
      );
    }
  }

  public interiorCenter(): Vector2 {
    return new Vector2(
      (this.interiorStart().x + this.interiorEnd().x) / 2.0,
      (this.interiorStart().y + this.interiorEnd().y) / 2.0,
    )
  }

  public exteriorEnd(): Vector2  {
    if (this.next != null) {
      const vec = this.halfAngleVector(this, this.next);
      return new Vector2(
        this.getEnd().x - vec.x,
        this.getEnd().y - vec.y
      )
    } else {
      return new Vector2(
        this.getEnd().x,
        this.getEnd().y
      )
    }
  }

  public exteriorStart(): Vector2  {
    if (this.prev != null) {
      const vec = this.halfAngleVector(this.prev, this);
      return new Vector2(
        this.getStart().x - vec.x,
        this.getStart().y - vec.y
      );
    } else {
      return new Vector2(
        this.getStart().x,
        this.getStart().y
      )
    }
  }

  /** Get the corners of the half edge.
   * @returns An array of x,y pairs.
   */
  public corners(): Vector2[] {
    return [this.interiorStart(), this.interiorEnd(),
      this.exteriorEnd(), this.exteriorStart()];
  }

  /** 
   * Gets CCW angle from v1 to v2
   */
  private halfAngleVector(v1: HalfEdge, v2: HalfEdge): Vector2 {
    // make the best of things if we dont have prev or next
    let v1startX: number;
    let v1startY: number;
    let v1endX: number;
    let v1endY: number;

    if (!v1) {
      v1startX = v2.getStart().x - (v2.getEnd().x - v2.getStart().x);
      v1startY = v2.getStart().y - (v2.getEnd().y - v2.getStart().y);
      v1endX = v2.getStart().x;
      v1endY = v2.getStart().y;
    } else {
      v1startX = <number>v1.getStart().x;
      v1startY = <number>v1.getStart().y;
      v1endX = v1.getEnd().x;
      v1endY = v1.getEnd().y;
    }

    let v2startX: number;
    let v2startY: number;
    let v2endX: number;
    let v2endY: number;

    if (!v2) {
      v2startX = v1.getEnd().x;
      v2startY = v1.getEnd().y;
      v2endX = v1.getEnd().x + (v1.getEnd().x - v1.getStart().x);
      v2endY = v1.getEnd().y + (v1.getEnd().y - v1.getStart().y);
    } else {
      v2startX = v2.getStart().x;
      v2startY = v2.getStart().y;
      v2endX = v2.getEnd().x;
      v2endY = v2.getEnd().y;
    }

    // CCW angle between edges
    const theta = Utils.angle2pi(
      v1startX - v1endX,
      v1startY - v1endY,
      v2endX - v1endX,
      v2endY - v1endY);

    // cosine and sine of half angle
    const cs = Math.cos(theta / 2.0);
    const sn = Math.sin(theta / 2.0);

    // rotate v2
    const v2dx = v2endX - v2startX;
    const v2dy = v2endY - v2startY;

    const vx = v2dx * cs - v2dy * sn;
    const vy = v2dx * sn + v2dy * cs;

    // normalize
    const mag = Utils.distance(0, 0, vx, vy);
    const desiredMag = (this.offset) / sn;
    const scalar = desiredMag / mag;

    const halfAngleVector = new Vector2(
      vx * scalar,
      vy * scalar
    );

    return halfAngleVector;
  }
}