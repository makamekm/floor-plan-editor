import { Mesh, Vector3 } from "three";
import { Callback } from "../utils/callback";
import { Utils } from "../utils/operations";
import { FloorplanDto } from "./floor.dto";
import { Corner } from "./floorplan-entities/corner.model";
import { HalfEdge } from "./floorplan-entities/half-edge.model";
import { ItemDict } from "./floorplan-entities/item.dict";
import { Item, ItemMetadata } from "./floorplan-entities/item.model";
import { Room } from "./floorplan-entities/room.model";
import { Wall } from "./floorplan-entities/wall.model";
import { FloorplanMode } from "./floorplan-mode.enum";

const defaultFloorPlanTolerance = 10.0;

/**
 * A Floorplan represents a number of Walls, Corners and Rooms.
 */
export class FloorplanModel {

  public onSelectedItemChange = new Callback<number>();
  public roomLoadedCallbacks = new Callback();

  private walls: Wall[] = [];
  private corners: Corner[] = [];
  private rooms: Room[] = [];
  private items: Item[] = [];
  private selectedItemIndex: number | null = null;
  private demo = false;

  public setDemoMode(value: boolean) {
    this.demo = value;
  }

  public getDemoMode() {
    return this.demo;
  }

  public setSelectedItem(value: Item | null, fire = false) {
    let index = this.items.indexOf(value);
    index = index >= 0 ? index : null;
    if (index !== this.selectedItemIndex && fire) {
      this.onSelectedItemChange.fire(index);
    }
    this.selectedItemIndex = index;
  }

  public getSelectedItem() {
    return this.selectedItemIndex != null
      ? this.items[this.selectedItemIndex]
      : null;
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

  /**
   * Creates a new wall.
   * @param start The start corner.
   * @param end he end corner.
   * @returns The new wall.
   */
  public newWall(start: Corner, end: Corner): Wall {
    const wall = new Wall(this, start, end);
    this.walls.push(wall);
    this.update();
    return wall;
  }

  /** Removes a wall.
   * @param wall The wall to be removed.
   */
  public removeWall(wall: Wall) {
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
    return corner;
  }

  /** Removes a corner.
   * @param corner The corner to be removed.
   */
  public removeCorner(corner: Corner) {
    Utils.removeValue(this.corners, corner);
  }

  /**
   * Creates a new item.
   * @param x The x coordinate.
   * @param y The y coordinate.
   * @returns The new item.
   */
  public newItem(x: number, y: number, metadata: ItemMetadata): Item {
    const item = new (ItemDict[metadata.type] as any)(this, x, y, metadata);
    this.items.push(item);
    return item;
  }

  /** Removes a item.
   * @param item The item to be removed.
   */
  public removeItem(item: Item) {
    if (this.getSelectedItem() === item) {
      this.setSelectedItem(null);
    }

    Utils.removeValue(this.items, item);
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

  /** Gets the items. */
  public getItems(): Item[] {
    return this.items;
  }

  public overlappedItem(x: number, y: number, scale: number, mode: FloorplanMode): Item {
    for (const item of this.items) {
      if (item.overlapped(
        x,
        y,
        scale,
        this.getSelectedItem() === item,
        mode,
      )) {
        return item;
      }
    }
    return null;
  }

  public overlappedCorner(x: number, y: number, scale: number, tolerance?: number): Corner {
    tolerance = tolerance || defaultFloorPlanTolerance;
    for (const corner of this.corners) {
      if (corner.distanceFrom(x, y, scale) < tolerance) {
        return corner;
      }
    }
    return null;
  }

  public overlappedWall(x: number, y: number, scale: number, tolerance?: number): Wall {
    tolerance = tolerance || defaultFloorPlanTolerance;
    for (const wall of this.walls) {
      if (wall.distanceFrom(x, y, scale) < tolerance) {
        return wall;
      }
    }
    return null;
  }

  public exportFloorplan() {
    const floorplan: FloorplanDto = {
      corners: {},
      walls: [],
      items: [],
    };

    this.corners.forEach((corner) => {
      floorplan.corners[corner.id] = {
        x: corner.x,
        y: corner.y,
      };
    });

    this.walls.forEach((wall) => {
      floorplan.walls.push({
        corner1: wall.getStart().id,
        corner2: wall.getEnd().id,
      });
    });

    this.items.forEach((item) => {
      floorplan.items.push({
        x: item.x,
        y: item.y,
        r: item.metadata.r,
        id: item.metadata.id,
        description: item.metadata.description,
        name: item.metadata.name,
        type: item.metadata.type,
        height: item.metadata.height,
        width: item.metadata.width,
      });
    });

    return floorplan;
  }

  public loadFloorplan(floorplan: FloorplanDto, reset = true) {
    if (reset) {
      this.reset();
    }

    const corners: {
      [id: string]: Corner;
    } = {};

    for (const id of Object.keys(floorplan.corners)) {
      const corner = floorplan.corners[id];
      corners[id] = this.newCorner(corner.x, corner.y, id);
    }

    floorplan.walls.forEach((wall) => {
      this.newWall(
        corners[wall.corner1], corners[wall.corner2],
      );
    });

    floorplan.items.forEach((item) => {
      this.newItem(
        item.x,
        item.y,
        {
          id: item.id,
          description: item.description,
          name: item.name,
          type: item.type,
          r: item.r,
          height: item.height,
          width: item.width,
        },
      );
    });

    this.update();

    if (reset) {
      this.roomLoadedCallbacks.fire();
    }
  }

  public reset() {
    this.setSelectedItem(null);
    const tmpCorners = this.corners.slice(0);
    const tmpWalls = this.walls.slice(0);
    const tmpItems = this.items.slice(0);
    tmpCorners.forEach((corner) => {
      corner.remove();
    });
    tmpWalls.forEach((wall) => {
      wall.remove();
    });
    tmpItems.forEach((item) => {
      item.remove();
    });
    this.corners = [];
    this.walls = [];
    this.items = [];
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
      if (corner.x < xMin) { xMin = corner.x; }
      if (corner.x > xMax) { xMax = corner.x; }
      if (corner.y < zMin) { zMin = corner.y; }
      if (corner.y > zMax) { zMax = corner.y; }
    });

    let ret;
    if (xMin === Infinity || xMax === -Infinity || zMin === Infinity || zMax === -Infinity) {
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

  /*
    * Find the "rooms" in our planar straight-line graph.
    * Rooms are set of the smallest (by area) possible cycles in this graph.
    * @param corners The corners of the floorplan.
    * @returns The rooms, each room as an array of corners.
    */
  public findRooms(corners: Corner[]): Corner[][] {
    // find tightest loops, for each corner, for each adjacent
    // TODO: optimize this, only check corners with > 2 adjacents, or isolated cycles
    const loops: Corner[][] = [];

    corners.forEach((firstCorner) => {
      firstCorner.adjacentCorners().forEach((secondCorner) => {
        loops.push(this.findTightestCycle(firstCorner, secondCorner));
      });
    });

    // remove duplicates
    const uniqueLoops = this.removeDuplicateRooms(loops);

    // remove CW loops
    const uniqueCCWLoops = uniqueLoops.filter((i) => !Utils.isClockwise(i));

    return uniqueCCWLoops;
  }

  public calculateTheta(previousCorner: Corner, currentCorner: Corner, nextCorner: Corner) {
    const theta = Utils.angle2pi(
      previousCorner.x - currentCorner.x,
      previousCorner.y - currentCorner.y,
      nextCorner.x - currentCorner.x,
      nextCorner.y - currentCorner.y,
    );
    return theta;
  }

  public removeDuplicateRooms(roomArray: Corner[][]): Corner[][] {
    const results: Corner[][] = [];
    const lookup: {
      [id: string]: boolean;
    } = {};
    const hashFunc = (corner: Corner) => {
      return corner.id;
    };
    const sep = "-";
    for (const room of roomArray) {
      // rooms are cycles, shift it around to check uniqueness
      let add = true;
      let str: string;
      for (let j = 0; j < room.length; j++) {
        const roomShift = Utils.cycle(room, j);
        str = roomShift.map(hashFunc).join(sep);
        if (lookup.hasOwnProperty(str)) {
          add = false;
        }
      }
      if (add && str) {
        results.push(room);
        lookup[str] = true;
      }
    }
    return results;
  }

  public findTightestCycle(firstCorner: Corner, secondCorner: Corner): Corner[] {
    const stack: Array<{
      corner: Corner,
      previousCorners: Corner[],
    }> = [];

    let next = {
      corner: secondCorner,
      previousCorners: [firstCorner],
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
      for (const nextCorner of adjacentCorners) {
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
        addToStack.sort((a, b) => {
          return (this.calculateTheta(previousCorner, currentCorner, b) -
            this.calculateTheta(previousCorner, currentCorner, a));
        });
      }

      if (addToStack.length > 0) {
        // add to the stack
        addToStack.forEach((corner) => {
          stack.push({
            corner,
            previousCorners,
          });
        });
      }

      // pop off the next one
      next = stack.pop();
    }
    return [];
  }

  private assignOrphanEdges() {
    // kinda hacky
    // find orphaned wall segments (i.e. not part of rooms) and
    // give them edges
    const orphanWalls = [];
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
}
