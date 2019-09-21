import { Item } from "./item.model";
import { Utils } from "../../utils/operations";
import { FloorplanView } from "../floorplan-view";

const tableHeight = 100;
const tableWidth = 50;
const tableColor = "#dddddd";
const tableColorHover = "#008cba";
const tableEdgeColor = "#888888";
const tableEdgeColorHover = "#008cba";
const tableEdgeWidth = 1;

const rotateRadius = 100;
const rotateLineWidth = 10;
const rotateColor = "#888888";
const rotateHoverColor = "#2196F3";
const rotateActiveColor = "#2196F3";

export class TableItem extends Item {

  public isRotating = false;
  public isRotatingHover = false;

  private overlappedRotate(x: number, y: number): boolean {
    const dist = Utils.pointDistance(this.x, this.y, x, y);
    return dist > rotateRadius * 2 - rotateLineWidth
      && dist < rotateRadius * 2 + rotateLineWidth;
  }

  mousedown(x: number, y: number) {
    const isRotating = this.overlappedRotate(x, y);
    if (isRotating !== this.isRotating) {
      this.isRotating = isRotating;
    }
  }

  startActive(): void {
    // Skip
  };

  endActive(): void {
    this.isRotating = false;
    this.isRotatingHover = false;
  };

  mouseup(x: number, y: number) {
    if (this.isRotating) {
      this.isRotating = false;
      this.roundAngle();
    }
  }

  mousemove(
    mouseX: number, mouseY: number,
    lastMouseX: number, lastMouseY: number,
  ) {
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

  private findClosestAngle(angles: number[], sens: number) {
    const a = Math.round(this.metadata.r);
    for (const roundingAngle of angles) {
      const r = Math.floor(
        (a % 360 + roundingAngle / 2) / roundingAngle
      ) * roundingAngle;
      if (Math.abs(r - a % 360) <= sens) {
        return r;
      }
    }
    return a;
  }

  private roundAngle(sens = 5) {
    this.metadata.r = this.findClosestAngle([30, 45], sens);
  }

  render(
    x: number,
    y: number,
    hover: boolean,
    selected: boolean,
    view: FloorplanView,
  ): void {
    view.drawTransaction((ctx) => {
      ctx.translate(x, y);
      ctx.rotate(this.metadata.r * Math.PI / 180);
      view.drawLine(0, -20, 0, 20, 10, hover ? "#0000ff" : (selected ? "#00ff00" : "#ff0000"));
    });
    if (selected) {
      view.drawTransaction((ctx) => {
        ctx.globalAlpha = this.isRotating ? 1 : (this.isRotatingHover ? 0.8 : 0.3);
        ctx.translate(x, y);
          view.drawCircleStroke(
            0,
            0,
            rotateRadius,
            this.isRotating ? rotateActiveColor : (this.isRotatingHover ? rotateHoverColor : rotateColor),
            rotateLineWidth / 2,
          );
      });
    }
  }

  overlapped(
    x: number,
    y: number,
    selected: boolean,
  ) {
    const sens = 50;
    const isMainHover = x < (this.x + sens) && x > (this.x - sens)
      && y < (this.y + sens) && y > (this.y - sens);
    if (selected) {
      this.isRotatingHover = this.overlappedRotate(x, y);
      return isMainHover || this.isRotatingHover;
    } else {
      return isMainHover;
    }
  }
}