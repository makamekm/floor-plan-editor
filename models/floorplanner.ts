import { FloorplannerView, floorplannerModes } from "./floorplanner-view";
import { Floorplan } from "./floorplan";
import { Corner } from "./corner";
import { Wall } from "./wall";

/** how much will we move a corner to make a wall axis aligned (cm) */
const snapTolerance = 25;

/** 
 * The Floorplanner implements an interactive tool for creation of floorplans.
 */
export class Floorplanner {

  /** */
  public mode = 0;

  /** */
  public activeWall: Wall | null = null;

  /** */
  public activeCorner: Corner | null = null;

  /** */
  public originX = 0;

  /** */
  public originY = 0;

  /** drawing state */
  public targetX = 0;

  /** drawing state */
  public targetY = 0;

  /** drawing state */
  public lastNode: Corner | null = null;

  /** */
  private wallWidth: number;

  /** */
  private canvasElement: HTMLCanvasElement;

  /** */
  private view: FloorplannerView;

  /** */
  private mouseDown = false;

  /** */
  private mouseMoved = false;

  /** in ThreeJS coords */
  private mouseX = 0;

  /** in ThreeJS coords */
  private mouseY = 0;

  /** in ThreeJS coords */
  private rawMouseX = 0;

  /** in ThreeJS coords */
  private rawMouseY = 0;

  /** mouse position at last click */
  private lastX = 0;

  /** mouse position at last click */
  private lastY = 0;

  /** */
  private cmPerPixel: number;

  /** */
  private pixelsPerCm: number;

  /** */
  constructor(canvas: string, private floorplan: Floorplan) {

    this.canvasElement = <HTMLCanvasElement>document.getElementById(canvas);

    this.view = new FloorplannerView(this.floorplan, this, canvas);

    const cmPerFoot = 30.48;
    const pixelsPerFoot = 15.0;
    this.cmPerPixel = cmPerFoot * (1.0 / pixelsPerFoot);
    this.pixelsPerCm = 1.0 / this.cmPerPixel;

    this.wallWidth = 10.0 * this.pixelsPerCm;

    // Initialization:

    this.setMode(floorplannerModes.MOVE);

    this.canvasElement.addEventListener("mousedown", () => {
      this.mousedown();
    });
    this.canvasElement.addEventListener("mousemove", (event) => {
      this.mousemove(event);
    });
    this.canvasElement.addEventListener("mouseup", () => {
      this.mouseup();
    });
    this.canvasElement.addEventListener("mouseleave", () => {
      this.mouseleave();
    });

    document.addEventListener("keyup", (e) => {
      if (e.keyCode == 27) {
        this.escapeKey();
      }
    });

    floorplan.roomLoadedCallbacks.add(() => {
      this.reset()
    });
  }

  /** */
  private escapeKey() {
    this.setMode(floorplannerModes.MOVE);
  }

  /** */
  private updateTarget() {
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
  private mousedown() {
    this.mouseDown = true;
    this.mouseMoved = false;
    this.lastX = this.rawMouseX;
    this.lastY = this.rawMouseY;

    // delete
    if (this.mode == floorplannerModes.DELETE) {
      if (this.activeCorner != null) {
        this.activeCorner.removeAll();
      } else if (this.activeWall) {
        this.activeWall.remove();
      } else {
        this.setMode(floorplannerModes.MOVE);
      }
    }
  }

  /** */
  private mousemove(event: MouseEvent) {
    this.mouseMoved = true;

    // update mouse
    this.rawMouseX = event.clientX;
    this.rawMouseY = event.clientY;

    this.mouseX = (event.clientX - this.canvasElement.getBoundingClientRect().left) * this.cmPerPixel + this.originX * this.cmPerPixel;
    this.mouseY = (event.clientY - this.canvasElement.getBoundingClientRect().top) * this.cmPerPixel + this.originY * this.cmPerPixel;

    // update target (snapped position of actual mouse)
    if (this.mode == floorplannerModes.DRAW || (this.mode == floorplannerModes.MOVE && this.mouseDown)) {
      this.updateTarget();
    }

    // update object target
    if (this.mode != floorplannerModes.DRAW && !this.mouseDown) {
      const hoverCorner = this.floorplan.overlappedCorner(this.mouseX, this.mouseY);
      const hoverWall = this.floorplan.overlappedWall(this.mouseX, this.mouseY);
      let draw = false;
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
  private mouseup() {
    this.mouseDown = false;

    // drawing
    if (this.mode == floorplannerModes.DRAW && !this.mouseMoved) {
      const corner = this.floorplan.newCorner(this.targetX, this.targetY);
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
  private mouseleave() {
    this.mouseDown = false;
    //scope.setMode(scope.modes.MOVE);
  }

  /** */
  private reset() {
    this.resizeView();
    this.setMode(floorplannerModes.MOVE);
    this.resetOrigin();
    this.view.draw();
  }

  /** */
  private resizeView() {
    this.view.handleWindowResize();
  }

  /** */
  private setMode(mode: number) {
    this.lastNode = null;
    this.mode = mode;
    this.updateTarget();
  }

  /** Sets the origin so that floorplan is centered */
  private resetOrigin() {
    const centerX = this.canvasElement.getBoundingClientRect().width / 2.0;
    const centerY = this.canvasElement.getBoundingClientRect().height / 2.0;
    const centerFloorplan = this.floorplan.getCenter();
    this.originX = centerFloorplan.x * this.pixelsPerCm - centerX;
    this.originY = centerFloorplan.z * this.pixelsPerCm - centerY;
  }

  /** Convert from THREEjs coords to canvas coords. */
  public convertX(x: number): number {
    return (x - this.originX * this.cmPerPixel) * this.pixelsPerCm;
  }

  /** Convert from THREEjs coords to canvas coords. */
  public convertY(y: number): number {
    return (y - this.originY * this.cmPerPixel) * this.pixelsPerCm;
  }
}