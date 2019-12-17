import { Utils } from "../../utils/operations";
import { FloorplanMode } from "../floorplan-mode.enum";
import { FloorplanModel } from "../floorplan-model";
import { FloorplanView } from "../floorplan-view";
import { Item, ItemMetadata } from "./item.model";

const rotateRadius = 100;
const rotateLineWidth = 10;
const rotateColor = "#888888";
const rotateHoverColor = "#2196F3";
const rotateActiveColor = "#2196F3";

const tableColorHover = "#888888";
const tableColorActive = "#888888";

const tableHeight = 60;
const tableWidth = 30;

export class LabelItem extends Item {

  public isRotating = false;
  public isRotatingHover = false;

  constructor(
    floorplan: FloorplanModel,
    x: number,
    y: number,
    metadata: ItemMetadata,
  ) {
    super(floorplan, x, y, metadata);
  }

  public startActive(): void {}

  public endActive(): void {
    this.isRotating = false;
    this.isRotatingHover = false;
  }

  public mousedown(x: number, y: number, mode: FloorplanMode): void {
    const isRotating = this.overlappedRotate(x, y);
    if (isRotating !== this.isRotating) {
      this.isRotating = isRotating;
    }
  }

  public mouseup(x: number, y: number, mode: FloorplanMode): boolean | void {
    if (this.isRotating) {
      this.isRotating = false;
      // this.roundAngle();
      return true;
    }
  }

  public mousemove(mouseX: number, mouseY: number, lastMouseX: number, lastMouseY: number, mode: FloorplanMode): boolean | void {
    if (this.isRotating) {
      const rLast = Math.atan2(
        lastMouseY - this.y,
        lastMouseX - this.x,
      );
      const rNew = Math.atan2(
        mouseY - this.y,
        mouseX - this.x,
      );
      this.relativeRotate(rNew - rLast);
      return true;
    }
  }

  // tslint:disable-next-line: max-line-length
  public render(x: number, y: number, scale: number, hover: boolean, selected: boolean, mode: FloorplanMode, view: FloorplanView): void {

    const fillColor = hover ? tableColorHover : selected ? tableColorActive : "#000000";

    const text = this.metadata.name.toUpperCase() || "Write text...";

    const fontSize = 15 / scale;

    view.drawLabel(this.x, this.y, text , `bold ${fontSize}px Arial` , fillColor);
  }

  public rotateVector(x: number, y: number, ang: number) {
    ang = -ang * (Math.PI / 180);
    const cos = Math.cos(ang);
    const sin = Math.sin(ang);
    return {
      x: (x * cos - y * sin),
      y: (x * sin + y * cos),
    };
  }

  public overlapped(
    rawX: number,
    rawY: number,
    scale: number,
    selected: boolean,
    mode: FloorplanMode,
  ) {
    const { x, y } = this.rotateVector(rawX - this.x / scale, rawY - this.y / scale, this.metadata.r);
    const sens = 5;
    const isMainHover = x <= (tableWidth + sens) && x >= (-tableWidth - sens)
      && y <= (tableHeight + sens) && y >= (-tableHeight - sens);
    if (selected && mode === FloorplanMode.MOVE) {
      this.isRotatingHover = this.overlappedRotate(rawX, rawY);
      return isMainHover || this.isRotatingHover;
    } else {
      return isMainHover;
    }
  }

  private overlappedRotate(x: number, y: number): boolean {
    const dist = Utils.pointDistance(this.x, this.y, x, y);
    return dist > rotateRadius * 2 - rotateLineWidth
      && dist < rotateRadius * 2 + rotateLineWidth;
  }

}
