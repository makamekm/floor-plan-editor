import { DoubleSide, Mesh, MeshBasicMaterial, Shape, ShapeGeometry, Vector2 } from "three";
import { Callback } from "../../utils/callback";
import { Corner } from "./corner.model";
import { HalfEdge } from "./half-edge.model";

/**
 * A Room is the combination of a Floorplan with a floor plane.
 */
export class Room {

  public interiorCorners: Vector2[] = [];

  /** floor plane for intersection testing */
  public floorPlane: Mesh = null;
  private edgePointer: HalfEdge = null;

  private floorChangeCallbacks = new Callback();

  /**
   *  ordered CCW
   */
  constructor(public corners: Corner[]) {
    this.updateWalls();
    this.updateInteriorCorners();
    this.generatePlane();
  }

  public fireOnFloorChange(callback: () => void) {
    this.floorChangeCallbacks.add(callback);
  }

  private generatePlane() {
    const points: Vector2[] = [];
    this.interiorCorners.forEach((corner) => {
      points.push(new Vector2(
        corner.x,
        corner.y));
    });
    const shape = new Shape(points);
    const geometry = new ShapeGeometry(shape);
    this.floorPlane = new Mesh(geometry,
      new MeshBasicMaterial({
        side: DoubleSide,
      }));
    this.floorPlane.visible = false;
    this.floorPlane.rotation.set(Math.PI / 2, 0, 0);
    (this.floorPlane as any).room = this; // js monkey patch
  }

  private updateInteriorCorners() {
    let edge = this.edgePointer;
    while (true) {
      this.interiorCorners.push(edge.interiorStart());
      edge.generatePlane();
      if (edge.next === this.edgePointer) {
        break;
      } else {
        edge = edge.next;
      }
    }
  }

  /**
   * Populates each wall's half edge relating to this room
   * this creates a fancy doubly connected edge list (DCEL)
   */
  private updateWalls() {
    let prevEdge = null;
    let firstEdge = null;
    let edge;

    for (let i = 0; i < this.corners.length; i++) {

      const firstCorner = this.corners[i];
      const secondCorner = this.corners[(i + 1) % this.corners.length];

      // find if wall is heading in that direction
      const wallTo = firstCorner.wallTo(secondCorner);
      const wallFrom = firstCorner.wallFrom(secondCorner);

      if (wallTo) {
        edge = new HalfEdge(wallTo, true);
      } else if (wallFrom) {
        edge = new HalfEdge(wallFrom, false);
      } else {
        // something horrible has happened
        console.log("corners arent connected by a wall, uh oh");
      }

      if (i == 0) {
        firstEdge = edge;
      } else {
        edge.prev = prevEdge;
        prevEdge.next = edge;
        if (i + 1 == this.corners.length) {
          firstEdge.prev = edge;
          edge.next = firstEdge;
        }
      }
      prevEdge = edge;
    }

    // hold on to an edge reference
    this.edgePointer = firstEdge;
  }
}
