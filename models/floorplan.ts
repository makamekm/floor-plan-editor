import { Wall } from "./wall";
import { Corner } from "./corner";
import { Room } from "./room";
import { Callback } from "../utils/callback";
import { HalfEdge } from "./half-edge";
import { Mesh, Vector3 } from "three";
import { Utils } from "../utils/operations";

export interface FloorplanSerialized {
  corners: {
    [id: string]: {
      x: number;
      y: number;
    }
  },
  walls: {
    corner1: string,
    corner2: string,
  }[],
}

/** */
const defaultFloorPlanTolerance = 10.0;

/** 
 * A Floorplan represents a number of Walls, Corners and Rooms.
 */
export class Floorplan {

  /** */
  private walls: Wall[] = [];

  /** */
  private corners: Corner[] = [];

  /** */
  private rooms: Room[] = [];

  /** */
  private new_wall_callbacks = new Callback<Wall>();

  /** */
  private new_corner_callbacks = new Callback<Corner>();

  /** */
  private redraw_callbacks = new Callback();

  /** */
  private updated_rooms = new Callback();

  /** */
  public roomLoadedCallbacks = new Callback();

  /** Constructs a floorplan. */
  constructor() {
  }

  // hack
  public wallEdges(): HalfEdge[] {
    const edges: HalfEdge[] = [];

    this.walls.forEach((wall) => {
      if (wall.frontEdge) {
        edges.push(wall.frontEdge);
      }
      if (wall.backEdge) {
        edges.push(wall.backEdge);
      }
    });

    return edges;
  }

  // hack
  public wallEdgePlanes(): Mesh[] {
    const planes: Mesh[] = [];

    this.walls.forEach((wall) => {
      if (wall.frontEdge && wall.frontEdge.plane) {
        planes.push(wall.frontEdge.plane);
      }
      if (wall.backEdge && wall.backEdge.plane) {
        planes.push(wall.backEdge.plane);
      }
    });

    return planes;
  }

  public fireOnNewWall(callback: () => void) {
    this.new_wall_callbacks.add(callback);
  }

  public fireOnNewCorner(callback: () => void) {
    this.new_corner_callbacks.add(callback);
  }

  public fireOnRedraw(callback: () => void) {
    this.redraw_callbacks.add(callback);
  }

  public fireOnUpdatedRooms(callback: () => void) {
    this.updated_rooms.add(callback);
  }

  /**
   * Creates a new wall.
   * @param start The start corner.
   * @param end he end corner.
   * @returns The new wall.
   */
  public newWall(start: Corner, end: Corner): Wall {
    const wall = new Wall(start, end);
    this.walls.push(wall)
    wall.fireOnDelete(() => {
      this.removeWall(wall);
    });
    this.new_wall_callbacks.fire(wall);
    this.update();
    return wall;
  }

  /** Removes a wall.
   * @param wall The wall to be removed.
   */
  private removeWall(wall: Wall) {
    Utils.removeValue(this.walls, wall);
    this.update();
  }

  /**
   * Creates a new corner.
   * @param x The x coordinate.
   * @param y The y coordinate.
   * @param id An optional id. If unspecified, the id will be created internally.
   * @returns The new corner.
   */
  public newCorner(x: number, y: number, id?: string): Corner {
    const corner = new Corner(this, x, y, id);
    this.corners.push(corner);
    corner.fireOnDelete(() => {
      this.removeCorner(corner);
    });
    this.new_corner_callbacks.fire(corner);
    return corner;
  }

  /** Removes a corner.
   * @param corner The corner to be removed.
   */
  private removeCorner(corner: Corner) {
    Utils.removeValue(this.corners, corner);
  }

  /** Gets the walls. */
  public getWalls(): Wall[] {
    return this.walls;
  }

  /** Gets the corners. */
  public getCorners(): Corner[] {
    return this.corners;
  }

  /** Gets the rooms. */
  public getRooms(): Room[] {
    return this.rooms;
  }

  public overlappedCorner(x: number, y: number, tolerance?: number): Corner {
    tolerance = tolerance || defaultFloorPlanTolerance;
    for (let i = 0; i < this.corners.length; i++) {
      if (this.corners[i].distanceFrom(x, y) < tolerance) {
        return this.corners[i];
      }
    }
    return null;
  }

  public overlappedWall(x: number, y: number, tolerance?: number): Wall {
    tolerance = tolerance || defaultFloorPlanTolerance;
    for (let i = 0; i < this.walls.length; i++) {
      if (this.walls[i].distanceFrom(x, y) < tolerance) {
        return this.walls[i];
      }
    }
    return null;
  }

  // import and export -- cleanup

  public exportFloorplan() {
    const floorplan: FloorplanSerialized = {
      corners: {},
      walls: [],
    }

    this.corners.forEach((corner) => {
      floorplan.corners[corner.id] = {
        'x': corner.x,
        'y': corner.y
      };
    });

    this.walls.forEach((wall) => {
      floorplan.walls.push({
        corner1: wall.getStart().id,
        corner2: wall.getEnd().id,
      });
    });
    return floorplan;
  }

  public loadFloorplan(floorplan: FloorplanSerialized) {
    this.reset();

    const corners: {
      [id: string]: Corner;
    } = {};

    if (floorplan == null || !('corners' in floorplan) || !('walls' in floorplan)) {
      return;
    }

    for (const id in floorplan.corners) {
      const corner = floorplan.corners[id];
      corners[id] = this.newCorner(corner.x, corner.y, id);
    }

    floorplan.walls.forEach((wall) => {
      this.newWall(
        corners[wall.corner1], corners[wall.corner2]
      );
    });

    this.update();
    this.roomLoadedCallbacks.fire();
  }

  /** */
  private reset() {
    const tmpCorners = this.corners.slice(0);
    const tmpWalls = this.walls.slice(0);
    tmpCorners.forEach((corner) => {
      corner.remove();
    })
    tmpWalls.forEach((wall) => {
      wall.remove();
    })
    this.corners = [];
    this.walls = [];
  }

  /** 
   * Update rooms
   */
  public update() {
    this.walls.forEach((wall) => {
      wall.resetFrontBack();
    });

    const roomCorners = this.findRooms(this.corners);
    this.rooms = [];
    const scope = this;
    roomCorners.forEach((corners) => {
      scope.rooms.push(new Room(corners));
    });
    this.assignOrphanEdges();

    this.updated_rooms.fire();
  }

  /** 
   * Returns the center of the floorplan in the y plane
   */
  public getCenter() {
    return this.getDimensions(true);
  }

  public getSize() {
    return this.getDimensions(false);
  }

  public getDimensions(center: boolean = false) {
    center = center || false; // otherwise, get size

    let xMin = Infinity;
    let xMax = -Infinity;
    let zMin = Infinity;
    let zMax = -Infinity;
    this.corners.forEach((corner) => {
      if (corner.x < xMin) xMin = corner.x;
      if (corner.x > xMax) xMax = corner.x;
      if (corner.y < zMin) zMin = corner.y;
      if (corner.y > zMax) zMax = corner.y;
    });

    let ret;
    if (xMin == Infinity || xMax == -Infinity || zMin == Infinity || zMax == -Infinity) {
      ret = new Vector3();
    } else {
      if (center) {
        // center
        ret = new Vector3((xMin + xMax) * 0.5, 0, (zMin + zMax) * 0.5);
      } else {
        // size
        ret = new Vector3((xMax - xMin), 0, (zMax - zMin));
      }
    }
    return ret;
  }

  private assignOrphanEdges() {
    // kinda hacky
    // find orphaned wall segments (i.e. not part of rooms) and
    // give them edges
    const orphanWalls = []
    this.walls.forEach((wall) => {
      if (!wall.backEdge && !wall.frontEdge) {
        wall.orphan = true;
        const back = new HalfEdge(wall, false);
        back.generatePlane();
        const front = new HalfEdge(wall, true);
        front.generatePlane();
        orphanWalls.push(wall);
      }
    });

  }

  /*
    * Find the "rooms" in our planar straight-line graph.
    * Rooms are set of the smallest (by area) possible cycles in this graph.
    * @param corners The corners of the floorplan.
    * @returns The rooms, each room as an array of corners.
    */
  public findRooms(corners: Corner[]): Corner[][] {

    function _calculateTheta(previousCorner: Corner, currentCorner: Corner, nextCorner: Corner) {
      const theta = Utils.angle2pi(
        previousCorner.x - currentCorner.x,
        previousCorner.y - currentCorner.y,
        nextCorner.x - currentCorner.x,
        nextCorner.y - currentCorner.y);
      return theta;
    }

    function _removeDuplicateRooms(roomArray: Corner[][]): Corner[][] {
      const results: Corner[][] = [];
      const lookup: {
        [id: string]: boolean;
      } = {};
      const hashFunc = (corner: Corner) => {
        return corner.id
      };
      const sep = '-';
      for (let i = 0; i < roomArray.length; i++) {
        // rooms are cycles, shift it around to check uniqueness
        let add = true;
        const room = roomArray[i];
        let str: string;
        for (let j = 0; j < room.length; j++) {
          const roomShift = Utils.cycle(room, j);
          str = roomShift.map(hashFunc).join(sep);
          if (lookup.hasOwnProperty(str)) {
            add = false;
          }
        }
        if (add && str) {
          results.push(roomArray[i]);
          lookup[str] = true;
        }
      }
      return results;
    }

    function _findTightestCycle(firstCorner: Corner, secondCorner: Corner): Corner[] {
      const stack: {
        corner: Corner,
        previousCorners: Corner[]
      }[] = [];

      let next = {
        corner: secondCorner,
        previousCorners: [firstCorner]
      };
      const visited: {
        [id: string]: boolean;
      } = {};
      visited[firstCorner.id] = true;

      while (next) {
        // update previous corners, current corner, and visited corners
        const currentCorner = next.corner;
        visited[currentCorner.id] = true;

        // did we make it back to the startCorner?
        if (next.corner === firstCorner && currentCorner !== secondCorner) {
          return next.previousCorners;
        }

        const addToStack: Corner[] = [];
        const adjacentCorners = next.corner.adjacentCorners();
        for (let i = 0; i < adjacentCorners.length; i++) {
          const nextCorner = adjacentCorners[i];

          // is this where we came from?
          // give an exception if its the first corner and we aren't at the second corner
          if (nextCorner.id in visited &&
            !(nextCorner === firstCorner && currentCorner !== secondCorner)) {
            continue;
          }

          // nope, throw it on the queue  
          addToStack.push(nextCorner);
        }

        const previousCorners = next.previousCorners.slice(0);
        previousCorners.push(currentCorner);
        if (addToStack.length > 1) {
          // visit the ones with smallest theta first
          const previousCorner = next.previousCorners[next.previousCorners.length - 1];
          addToStack.sort(function (a, b) {
            return (_calculateTheta(previousCorner, currentCorner, b) -
              _calculateTheta(previousCorner, currentCorner, a));
          });
        }

        if (addToStack.length > 0) {
          // add to the stack
          addToStack.forEach((corner) => {
            stack.push({
              corner: corner,
              previousCorners: previousCorners
            });
          });
        }

        // pop off the next one
        next = stack.pop();
      }
      return [];
    }

    // find tightest loops, for each corner, for each adjacent
    // TODO: optimize this, only check corners with > 2 adjacents, or isolated cycles
    const loops: Corner[][] = [];

    corners.forEach((firstCorner) => {
      firstCorner.adjacentCorners().forEach((secondCorner) => {
        loops.push(_findTightestCycle(firstCorner, secondCorner));
      });
    });

    // remove duplicates
    const uniqueLoops = _removeDuplicateRooms(loops);

    //remove CW loops
    const uniqueCCWLoops = uniqueLoops.filter(i => !Utils.isClockwise(i));

    return uniqueCCWLoops;
  }
}
