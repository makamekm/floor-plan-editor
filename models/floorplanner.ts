import { FloorplannerView } from "./floorplanner-view";
import { Floorplan } from "./floorplan";
import { Corner } from "./corner";
import { Wall } from "./wall";
import { Callback } from "../utils/callback";
import { FloorplannerMode } from "./floorplanner-mode.enum";
import { Item } from "./item.model";

/** how much will we move a corner to make a wall axis aligned (cm) */
const snapTolerance = 25;

/** 
 * The Floorplanner implements an interactive tool for creation of floorplans.
 */
export class Floorplanner {

  public mode = 0;
  public activeWall: Wall | null = null;
  public activeCorner: Corner | null = null;
  public activeItem: Item | null = null;
  public onModeChange = new Callback<FloorplannerMode>();
  public originX = 0;
  public originY = 0;

  /** drawing state */
  public targetX = 0;

  /** drawing state */
  public targetY = 0;

  /** drawing state */
  public lastNode: Corner | null = null;

  private view: FloorplannerView;
  private mouseDown = false;
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

  private cmPerPixel: number;
  private pixelsPerCm: number;

  constructor(private canvasElement: HTMLCanvasElement, private floorplan: Floorplan) {

    this.view = new FloorplannerView(this.floorplan, this, canvasElement);

    const cmPerFoot = 30.48;
    const pixelsPerFoot = 15.0;
    this.cmPerPixel = cmPerFoot * (1.0 / pixelsPerFoot);
    this.pixelsPerCm = 1.0 / this.cmPerPixel;

    // Initialization:

    this.setMode(FloorplannerMode.MOVE);

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
      this.reset();
    });
  }

  private escapeKey() {
    this.setMode(FloorplannerMode.MOVE);
  }

  private updateTarget() {
    if (this.mode == FloorplannerMode.DRAW && this.lastNode) {
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

  private mousedown() {
    this.mouseDown = true;
    this.mouseMoved = false;
    this.lastX = this.rawMouseX;
    this.lastY = this.rawMouseY;

    // delete
    if (this.mode == FloorplannerMode.DELETE) {
      if (this.activeCorner) {
        this.activeCorner.removeAll();
      } else if (this.activeWall) {
        this.activeWall.remove();
      } else if (this.activeItem) {
        this.activeItem.remove();
      } else {
        this.setMode(FloorplannerMode.MOVE);
      }
    }
  }

  private mousemove(event: MouseEvent) {
    this.mouseMoved = true;

    // update mouse
    this.rawMouseX = event.clientX;
    this.rawMouseY = event.clientY;

    this.mouseX = (event.clientX - this.canvasElement.getBoundingClientRect().left) * this.cmPerPixel + this.originX * this.cmPerPixel;
    this.mouseY = (event.clientY - this.canvasElement.getBoundingClientRect().top) * this.cmPerPixel + this.originY * this.cmPerPixel;

    // update target (snapped position of actual mouse)
    if (
      this.mode == FloorplannerMode.DRAW
      || (this.mode == FloorplannerMode.MOVE && this.mouseDown)
    ) {
      this.updateTarget();
    }

    // update object target
    if (this.mode != FloorplannerMode.DRAW && !this.mouseDown) {
      const hoverItem = this.floorplan.overlappedItem(this.mouseX, this.mouseY);
      if (hoverItem) {
        this.activeItem = hoverItem;
        this.activeCorner == null;
        this.activeWall = null;
      } else {
        this.activeItem = null;
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
    if (this.mode == FloorplannerMode.MOVE && this.mouseDown) {
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
      this.checkWallDuplicates();
      this.view.draw();
    }
  }

  private mouseup() {
    this.mouseDown = false;

    // drawing
    if (this.mode == FloorplannerMode.DRAW && !this.mouseMoved) {
      const corner = this.floorplan.newCorner(this.targetX, this.targetY);
      if (this.lastNode != null) {
        this.floorplan.newWall(this.lastNode, corner);
      }
      if (corner.mergeWithIntersected() && this.lastNode != null) {
        this.setMode(FloorplannerMode.MOVE);
      }
      this.lastNode = corner;
      this.checkWallDuplicates();
    }
  }

  private checkWallDuplicates() {
    const duplicates: Wall[] = [];
    const walls = this.floorplan.getWalls();
    for (let i = 0; i < walls.length; i++) {
      for (let k = i + 1; k < walls.length; k++) {
        const wall = walls[i];
        const wallCheck = walls[k];
        if (
          wall !== wallCheck &&
          (
            (wall.getEnd() === wallCheck.getEnd() && wall.getStart() === wallCheck.getStart())
            ||
            (wall.getEnd() === wallCheck.getStart() && wall.getStart() === wallCheck.getEnd())
          )
        ) {
          duplicates.push(wallCheck);
        }
      }
    }
    for (const wall of duplicates) {
      wall.remove();
    }
  }

  private mouseleave() {
    this.mouseDown = false;
    //scope.setMode(scope.modes.MOVE);
  }

  public reset() {
    this.resizeView();
    this.setMode(FloorplannerMode.MOVE);
    this.resetOrigin();
    this.view.draw();
  }

  private resizeView() {
    this.view.handleWindowResize();
  }

  public setMode(mode: FloorplannerMode) {
    this.lastNode = null;
    this.mode = mode;
    this.updateTarget();
    this.onModeChange.fire(mode);
  }

  /** Sets the origin so that floorplan is centered */
  private resetOrigin() {
    const centerX = this.canvasElement.getBoundingClientRect().width / 2.0;
    const centerY = this.canvasElement.getBoundingClientRect().height / 2.0;
    const centerFloorplan = this.floorplan.getCenter();
    this.originX = centerFloorplan.x * this.pixelsPerCm - centerX;
    this.originY = centerFloorplan.z * this.pixelsPerCm - centerY;
  }

  /** Gets the center of the view */
  public getCenter() {
    const centerX = this.canvasElement.getBoundingClientRect().width / 2.0;
    const centerY = this.canvasElement.getBoundingClientRect().height / 2.0;
    return {
      x: this.originX + centerX,
      y: this.originY + centerY,
    };
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