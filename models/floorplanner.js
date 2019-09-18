import { FloorplannerView } from "./floorplanner.view";

const snapTolerance = 25;

export class Floorplanner {

  /** */
  mode = 0;

  /** */
  activeWall = null;

  /** */
  activeCorner = null;

  /** */
  originX = 0;

  /** */
  originY = 0;

  /** drawing state */
  targetX = 0;

  /** drawing state */
  targetY = 0;

  /** drawing state */
  lastNode = null;

  /** */
  wallWidth;

  /** */
  modeResetCallbacks = $.Callbacks();

  /** */
  canvasElement;

  /** */
  view;

  /** */
  mouseDown = false;

  /** */
  mouseMoved = false;

  /** in ThreeJS coords */
  mouseX = 0;

  /** in ThreeJS coords */
  mouseY = 0;

  /** in ThreeJS coords */
  rawMouseX = 0;

  /** in ThreeJS coords */
  rawMouseY = 0;

  /** mouse position at last click */
  lastX = 0;

  /** mouse position at last click */
  lastY = 0;

  /** */
  cmPerPixel;

  /** */
  pixelsPerCm;

  /** */
  constructor(canvas, floorplan) {

    this.canvasElement = $("#" + canvas);

    this.view = new FloorplannerView(this.floorplan, this, canvas);

    var cmPerFoot = 30.48;
    var pixelsPerFoot = 15.0;
    this.cmPerPixel = cmPerFoot * (1.0 / pixelsPerFoot);
    this.pixelsPerCm = 1.0 / this.cmPerPixel;

    this.wallWidth = 10.0 * this.pixelsPerCm;

    // Initialization:

    this.setMode(floorplannerModes.MOVE);

    var scope = this;

    this.canvasElement.mousedown(() => {
      scope.mousedown();
    });
    this.canvasElement.mousemove((event) => {
      scope.mousemove(event);
    });
    this.canvasElement.mouseup(() => {
      scope.mouseup();
    });
    this.canvasElement.mouseleave(() => {
      scope.mouseleave();
    });

    $(document).keyup((e) => {
      if (e.keyCode == 27) {
        scope.escapeKey();
      }
    });

    floorplan.roomLoadedCallbacks.add(() => {
      scope.reset();
    });
  }

  /** */
  escapeKey() {
    this.setMode(floorplannerModes.MOVE);
  }

  /** */
  updateTarget() {
    if (this.mode == floorplannerModes.DRAW && this.lastNode) {
      if (Math.abs(this.mouseX - this.lastNode.x) < snapTolerance) {
        this.targetX = this.lastNode.x;
      } else {
        this.targetX = this.mouseX;
      }
      if (Math.abs(this.mouseY - this.lastNode.y) < snapTolerance) {
        this.targetY = this.lastNode.y;
      } else {
        this.targetY = this.mouseY;
      }
    } else {
      this.targetX = this.mouseX;
      this.targetY = this.mouseY;
    }

    this.view.draw();
  }

  /** */
  mousedown() {
    this.mouseDown = true;
    this.mouseMoved = false;
    this.lastX = this.rawMouseX;
    this.lastY = this.rawMouseY;

    // delete
    if (this.mode == floorplannerModes.DELETE) {
      if (this.activeCorner) {
        this.activeCorner.removeAll();
      } else if (this.activeWall) {
        this.activeWall.remove();
      } else {
        this.setMode(floorplannerModes.MOVE);
      }
    }
  }

  /** */
  mousemove(event) {
    this.mouseMoved = true;

    // update mouse
    this.rawMouseX = event.clientX;
    this.rawMouseY = event.clientY;

    this.mouseX = (event.clientX - this.canvasElement.offset().left) * this.cmPerPixel + this.originX * this.cmPerPixel;
    this.mouseY = (event.clientY - this.canvasElement.offset().top) * this.cmPerPixel + this.originY * this.cmPerPixel;

    // update target (snapped position of actual mouse)
    if (this.mode == floorplannerModes.DRAW || (this.mode == floorplannerModes.MOVE && this.mouseDown)) {
      this.updateTarget();
    }

    // update object target
    if (this.mode != floorplannerModes.DRAW && !this.mouseDown) {
      var hoverCorner = this.floorplan.overlappedCorner(this.mouseX, this.mouseY);
      var hoverWall = this.floorplan.overlappedWall(this.mouseX, this.mouseY);
      var draw = false;
      if (hoverCorner != this.activeCorner) {
        this.activeCorner = hoverCorner;
        draw = true;
      }
      // corner takes precendence
      if (this.activeCorner == null) {
        if (hoverWall != this.activeWall) {
          this.activeWall = hoverWall;
          draw = true;
        }
      } else {
        this.activeWall = null;
      }
      if (draw) {
        this.view.draw();
      }
    }

    // panning
    if (this.mouseDown && !this.activeCorner && !this.activeWall) {
      this.originX += (this.lastX - this.rawMouseX);
      this.originY += (this.lastY - this.rawMouseY);
      this.lastX = this.rawMouseX;
      this.lastY = this.rawMouseY;
      this.view.draw();
    }

    // dragging
    if (this.mode == floorplannerModes.MOVE && this.mouseDown) {
      if (this.activeCorner) {
        this.activeCorner.move(this.mouseX, this.mouseY);
        this.activeCorner.snapToAxis(snapTolerance);
      } else if (this.activeWall) {
        this.activeWall.relativeMove(
          (this.rawMouseX - this.lastX) * this.cmPerPixel,
          (this.rawMouseY - this.lastY) * this.cmPerPixel
        );
        this.activeWall.snapToAxis(snapTolerance);
        this.lastX = this.rawMouseX;
        this.lastY = this.rawMouseY;
      }
      this.view.draw();
    }
  }

  /** */
  mouseup() {
    this.mouseDown = false;

    // drawing
    if (this.mode == floorplannerModes.DRAW && !this.mouseMoved) {
      var corner = this.floorplan.newCorner(this.targetX, this.targetY);
      if (this.lastNode != null) {
        this.floorplan.newWall(this.lastNode, corner);
      }
      if (corner.mergeWithIntersected() && this.lastNode != null) {
        this.setMode(floorplannerModes.MOVE);
      }
      this.lastNode = corner;
    }
  }

  /** */
  mouseleave() {
    this.mouseDown = false;
    //scope.setMode(scope.modes.MOVE);
  }

  /** */
  reset() {
    this.resizeView();
    this.setMode(floorplannerModes.MOVE);
    this.resetOrigin();
    this.view.draw();
  }

  /** */
  resizeView() {
    this.view.handleWindowResize();
  }

  /** */
  setMode(mode) {
    this.lastNode = null;
    this.mode = mode;
    this.modeResetCallbacks.fire(mode);
    this.updateTarget();
  }

  /** Sets the origin so that floorplan is centered */
  resetOrigin() {
    var centerX = this.canvasElement.innerWidth() / 2.0;
    var centerY = this.canvasElement.innerHeight() / 2.0;
    var centerFloorplan = this.floorplan.getCenter();
    this.originX = centerFloorplan.x * this.pixelsPerCm - centerX;
    this.originY = centerFloorplan.z * this.pixelsPerCm - centerY;
  }

  /** Convert from THREEjs coords to canvas coords. */
  convertX(x) {
    return (x - this.originX * this.cmPerPixel) * this.pixelsPerCm;
  }

  /** Convert from THREEjs coords to canvas coords. */
  convertY(y) {
    return (y - this.originY * this.cmPerPixel) * this.pixelsPerCm;
  }
}
