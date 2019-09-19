
/** Default texture to be used if nothing is provided. */
const defaultRoomTexture = {
  url: "rooms/textures/hardwood.png",
  scale: 400
}

/** 
 * A Room is the combination of a Floorplan with a floor plane. 
 */
export class Room {

  /** */
  interiorCorners = [];

  /** */
  edgePointer = null;

  /** floor plane for intersection testing */
  floorPlane = null;

  /** */
  customTexture = false;

  /** */
  floorChangeCallbacks = $.Callbacks();

  floorplan;
  corners;

  /**
   *  ordered CCW
   */
  constructor(floorplan, corners) {
    this.floorplan = floorplan;
    this.corners = corners;

    this.updateWalls();
    this.updateInteriorCorners();
    this.generatePlane();
  }

  getUuid() {
    var cornerUuids = Core.Utils.map(this.corners, function (c) {
      return c.id;
    });
    cornerUuids.sort();
    return cornerUuids.join();
  }

  fireOnFloorChange(callback) {
    this.floorChangeCallbacks.add(callback);
  }

  getTexture() {
    var uuid = this.getUuid();
    var tex = this.floorplan.getFloorTexture(uuid);
    return tex || defaultRoomTexture;
  }

  /** 
   * textureStretch always true, just an argument for consistency with walls
   */
  setTexture(textureUrl, textureStretch, textureScale) {
    var uuid = this.getUuid();
    this.floorplan.setFloorTexture(uuid, textureUrl, textureScale);
    this.floorChangeCallbacks.fire();
  }

  generatePlane() {
    var points = [];
    this.interiorCorners.forEach((corner) => {
      points.push(new THREE.Vector2(
        corner.x,
        corner.y));
    });
    var shape = new THREE.Shape(points);
    var geometry = new THREE.ShapeGeometry(shape);
    this.floorPlane = new THREE.Mesh(geometry,
      new THREE.MeshBasicMaterial({
        side: THREE.DoubleSide
      }));
    this.floorPlane.visible = false;
    this.floorPlane.rotation.set(Math.PI / 2, 0, 0);
    this.floorPlane.room = this;
  }

  cycleIndex(index) {
    if (index < 0) {
      return index += this.corners.length;
    } else {
      return index % this.corners.length;
    }
  }

  updateInteriorCorners() {
    var edge = this.edgePointer;
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
  updateWalls() {

    var prevEdge = null;
    var firstEdge = null;

    for (var i = 0; i < this.corners.length; i++) {

      var firstCorner = this.corners[i];
      var secondCorner = this.corners[(i + 1) % this.corners.length];

      // find if wall is heading in that direction
      var wallTo = firstCorner.wallTo(secondCorner);
      var wallFrom = firstCorner.wallFrom(secondCorner);

      if (wallTo) {
        var edge = new HalfEdge(this, wallTo, true);
      } else if (wallFrom) {
        var edge = new HalfEdge(this, wallFrom, false);
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