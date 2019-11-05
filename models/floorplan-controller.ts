import debounce from "debounce";
import { Callback } from "../utils/callback";
import { FloorplanDto } from "./floor.dto";
import { Corner } from "./floorplan-entities/corner.model";
import { Item } from "./floorplan-entities/item.model";
import { Wall } from "./floorplan-entities/wall.model";
import { FloorplanMode } from "./floorplan-mode.enum";
import { FloorplanModel } from "./floorplan-model";
import { FloorplanView } from "./floorplan-view";

/** how much will we move a corner to make a wall axis aligned (cm) */
const snapTolerance = 25;

const cmPerFoot = 30.48;
const pixelsPerFoot = 15.0;
const cmPerPixel = cmPerFoot * (1.0 / pixelsPerFoot);
const pixelsPerCm = 1.0 / cmPerPixel;

/**
 * The FloorplanController implements an interactive tool for creation of floorplans.
 */
export class FloorplanController {
  public set activeItem(item: Item) {
    const activeItem = this.activeItem;
    if (item !== activeItem) {
      if (!!activeItem) {
        activeItem.endActive();
      }
      if (!!item) {
        item.startActive();
      }
    }
    const index = this.floorplan.getItems().indexOf(item);
    this.activeItemIndex = index >= 0 ? index : null;
  }

  public get activeItem() {
    return this.activeItemIndex != null
    ? this.floorplan.getItems()[this.activeItemIndex]
    : null;
  }

  public mode = FloorplanMode.MOVE;
  public activeWall: Wall | null = null;
  public activeCorner: Corner | null = null;

  public onModeChange = new Callback<FloorplanMode>();
  public onModelChange = new Callback<{
    floorplan: FloorplanDto;
    x: number;
    y: number;
  }>();

  public originX = 0;
  public originY = 0;

  /** drawing state */
  public targetX = 0;

  /** drawing state */
  public targetY = 0;

  /** drawing state */
  public lastNode: Corner | null = null;

  private activeItemIndex: number | null = null;

  private emitChanges = debounce(() => {
    this.fireChanges();
  });

  private view: FloorplanView;
  private mouseDown = false;
  private mouseMoved = false;

  /** in ThreeJS coords */
  private mouseX = 0;

  /** in ThreeJS coords */
  private mouseY = 0;

  /** mouse position at last click */
  private lastX = 0;

  /** mouse position at last click */
  private lastY = 0;

  /** mouse position at last click */
  private lastRawX = 0;

  /** mouse position at last click */
  private lastRawY = 0;

  constructor(private canvasElement: HTMLCanvasElement, private floorplan: FloorplanModel) {

    this.view = new FloorplanView(this.floorplan, this, canvasElement);

    // Initialization:

    this.setMode(FloorplanMode.MOVE);

    this.canvasElement.addEventListener("mousedown", (event) => {
      this.mousedown(event.clientX, event.clientY);
    });
    this.canvasElement.addEventListener("touchstart", (event) => {
      event.preventDefault();
      this.mousemove(event.touches[0].clientX, event.touches[0].clientY);
      this.mousedown(event.touches[0].clientX, event.touches[0].clientY);
    });

    this.canvasElement.addEventListener("mousemove", (event) => {
      this.mousemove(event.clientX, event.clientY);
    });
    this.canvasElement.addEventListener("touchmove", (event) => {
      this.mousemove(event.touches[0].clientX, event.touches[0].clientY);
    });

    this.canvasElement.addEventListener("mouseup", (event) => {
      this.mouseup(event.clientX, event.clientY);
    });

    this.canvasElement.addEventListener("touchend", (event) => {
      event.preventDefault();
      this.mouseup(event.changedTouches[0].clientX, event.changedTouches[0].clientY);
    });

    this.canvasElement.addEventListener("mouseleave", () => {
      this.mouseleave();
    });
    this.canvasElement.addEventListener("touchleave", () => {
      event.preventDefault();
      this.mouseleave();
    });

    document.addEventListener("keyup", (e) => {
      if (e.keyCode === 27) {
        this.escapeKey();
      }
    });

    floorplan.roomLoadedCallbacks.add(() => {
      this.reset();
    });
  }

  public getModel() {
    return {
      x: this.originX,
      y: this.originY,
      floorplan: this.floorplan.exportFloorplan(),
    };
  }

  public fireChanges() {
    this.onModelChange.fire({
      x: this.originX,
      y: this.originY,
      floorplan: this.floorplan.exportFloorplan(),
    });
  }

  public draw() {
    this.view.draw();
  }

  public reset() {
    this.resizeView();
    if (this.mode != null) {
      this.setMode(FloorplanMode.MOVE);
    }
    this.resetOrigin();
    this.view.draw();
  }

  public setMode(mode: FloorplanMode) {
    this.activeWall = null;
    this.activeCorner = null;
    this.activeItem = null;
    this.lastNode = null;
    this.floorplan.setSelectedItem(null, true);
    this.mode = mode;
    this.updateTarget();
    this.onModeChange.fire(mode);
    this.view.draw();
  }

  /** Gets the center of the view */
  public getCenter() {
    const centerX = this.canvasElement.getBoundingClientRect().width / 2.0;
    const centerY = this.canvasElement.getBoundingClientRect().height / 2.0;
    return {
      x: (this.originX + centerX) * cmPerPixel,
      y: (this.originY + centerY) * cmPerPixel,
    };
  }

  /** Convert from THREEjs coords to canvas coords. */
  public convertX(x: number): number {
    return (x - this.originX * cmPerPixel) * pixelsPerCm;
  }

  /** Convert from THREEjs coords to canvas coords. */
  public convertY(y: number): number {
    return (y - this.originY * cmPerPixel) * pixelsPerCm;
  }

  private escapeKey() {
    this.setMode(FloorplanMode.MOVE);
  }

  private updateTarget() {
    if (this.mode === FloorplanMode.DRAW && this.lastNode) {
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
  }

  private mousedown(clientX: number, clientY: number) {
    this.mouseDown = true;
    this.mouseMoved = false;
    this.lastX = this.mouseX;
    this.lastY = this.mouseY;
    this.lastRawX = clientX;
    this.lastRawY = clientY;

    const selectedItem = this.floorplan.getSelectedItem();

    // delete
    if (this.mode === FloorplanMode.DELETE) {
      if (this.activeCorner) {
        this.activeCorner.removeAll();
        this.emitChanges();
      } else if (this.activeWall) {
        this.activeWall.remove();
        this.emitChanges();
      } else if (this.activeItem) {
        this.activeItem.remove();
        this.emitChanges();
      }
    } else {
      if (selectedItem) {
        selectedItem.mousedown(this.mouseX, this.mouseY, this.mode);
      }
    }

    this.view.draw();
  }

  private calculateMouseMoveDistance(mouseX: number, lastX: number, mouseY: number, lastY: number) {
    return Math.sqrt(Math.pow((mouseX - lastX), 2) + Math.pow((mouseY - lastY), 2));
  }

  private mousemove(clientX: number, clientY: number) {

    // update mouse
    this.mouseX = (clientX - this.canvasElement.getBoundingClientRect().left) * cmPerPixel + this.originX * cmPerPixel;
    this.mouseY = (clientY - this.canvasElement.getBoundingClientRect().top) * cmPerPixel + this.originY * cmPerPixel;

    if (this.calculateMouseMoveDistance(this.mouseX, this.lastX, this.mouseY, this.lastY) < 3) {
      return;
    }
    this.mouseMoved = true;

    const selectedItem = this.floorplan.getSelectedItem();

    // update target (snapped position of actual mouse)
    if (
      this.mode === FloorplanMode.DRAW
      || (this.mode === FloorplanMode.MOVE && this.mouseDown)
    ) {
      this.updateTarget();
      this.view.draw();
    }

    // update object target
    if (this.mode !== FloorplanMode.DRAW && !this.mouseDown) {
      let draw = false;
      const hoverItem = this.floorplan.overlappedItem(this.mouseX, this.mouseY, this.mode);
      if (hoverItem !== this.activeItem) {
        draw = true;
      }
      if (hoverItem) {
        this.activeItem = hoverItem;
        this.activeCorner = null;
        this.activeWall = null;
      } else {
        this.activeItem = null;
        const hoverCorner = this.floorplan.overlappedCorner(this.mouseX, this.mouseY);
        const hoverWall = this.floorplan.overlappedWall(this.mouseX, this.mouseY);
        if (hoverCorner !== this.activeCorner) {
          this.activeCorner = hoverCorner;
          draw = true;
        }
        // corner takes precendence
        if (this.activeCorner == null) {
          if (hoverWall !== this.activeWall) {
            this.activeWall = hoverWall;
            draw = true;
          }
        } else {
          this.activeWall = null;
        }
      }
      if (draw) {
        this.view.draw();
      }
    }

    // panning
    if (this.mouseDown && !this.activeCorner && !this.activeWall && !this.activeItem) {
      this.originX -= clientX - this.lastRawX;
      this.originY -= clientY - this.lastRawY;
      this.lastRawX = clientX;
      this.lastRawY = clientY;
      this.view.draw();
    }

    // dragging
    if (this.mouseDown) {
      if (
        selectedItem
        && selectedItem === this.activeItem
        && selectedItem.mousemove(
          this.mouseX,
          this.mouseY,
          this.lastX,
          this.lastY,
          this.mode,
        )
      ) {
        this.emitChanges();
        this.lastX = this.mouseX;
        this.lastY = this.mouseY;
        this.view.draw();
      } else if (this.mode === FloorplanMode.MOVE) {
        if (this.activeItem) {
          this.activeItem.relativeMove(
            this.mouseX - this.lastX,
            this.mouseY - this.lastY,
          );
          this.emitChanges();
        } else if (this.activeCorner) {
          this.activeCorner.move(this.mouseX, this.mouseY);
          this.activeCorner.snapToAxis(snapTolerance);
          this.checkWallDuplicates();
          this.emitChanges();
        } else if (this.activeWall) {
          this.activeWall.relativeMove(
            this.mouseX - this.lastX,
            this.mouseY - this.lastY,
          );
          this.activeWall.snapToAxis(snapTolerance);
          this.checkWallDuplicates();
          this.emitChanges();
        }
        this.lastX = this.mouseX;
        this.lastY = this.mouseY;
        this.view.draw();
      }
    }
  }

  private mouseup(clientX: number, clientY: number) {
    this.mouseDown = false;

    this.mouseX = (clientX - this.canvasElement.getBoundingClientRect().left) * cmPerPixel + this.originX * cmPerPixel;
    this.mouseY = (clientY - this.canvasElement.getBoundingClientRect().top) * cmPerPixel + this.originY * cmPerPixel;

    const selectedItem = this.floorplan.getSelectedItem();

    if (selectedItem) {
      if (selectedItem.mouseup(this.mouseX, this.mouseY, this.mode)) {
        this.view.draw();
        this.emitChanges();
      }
    }

    // drawing
    if (this.mode === FloorplanMode.DRAW && !this.mouseMoved) {
      const corner = this.floorplan.newCorner(this.targetX, this.targetY);
      if (this.lastNode != null) {
        this.floorplan.newWall(this.lastNode, corner);
      }
      if (corner.mergeWithIntersected() && this.lastNode != null) {
        this.setMode(FloorplanMode.MOVE);
      }
      this.lastNode = corner;
      this.checkWallDuplicates();
      this.view.draw();
      this.emitChanges();
    } else if (!this.mouseMoved && this.mode === FloorplanMode.MOVE || this.mode == null) {
      if (this.activeItem) {
        this.floorplan.setSelectedItem(this.activeItem, true);
      } else {
        this.floorplan.setSelectedItem(null, true);
      }
      this.view.draw();
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
    this.activeCorner = null;
    this.activeWall = null;
    this.activeItem = null;
    this.view.draw();
    // scope.setMode(scope.modes.MOVE);
  }

  private resizeView() {
    this.view.handleWindowResize();
  }

  /** Sets the origin so that floorplan is centered */
  private resetOrigin() {
    const centerX = this.canvasElement.getBoundingClientRect().width / 2.0;
    const centerY = this.canvasElement.getBoundingClientRect().height / 2.0;
    const centerFloorplan = this.floorplan.getCenter();
    this.originX = centerFloorplan.x * pixelsPerCm - centerX;
    this.originY = centerFloorplan.z * pixelsPerCm - centerY;
  }
}
