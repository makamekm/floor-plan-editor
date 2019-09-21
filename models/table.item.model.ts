import { Item } from "./item.model";
import { Utils } from "../utils/operations";
import { Floorplan } from "./floorplan";
import { FloorplannerView } from "./floorplanner-view";

const rotateRadius = 100;
const rotateLineWidth = 8;
const rotateColor = "#888888";
const rotateHoverColor = "#008cba";
const rotateActiveColor = "#ff0000";

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

  };

  endActive(): void {
    this.isRotating = false;
    this.isRotatingHover = false;
  };

  mouseup(x: number, y: number) {
    this.isRotating = false;
    this.isRotatingHover = false;
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

  render(
    x: number,
    y: number,
    hover: boolean,
    selected: boolean,
    view: FloorplannerView,
  ): void {
    view.drawTransaction((ctx) => {
      ctx.translate(x, y);
      ctx.rotate(this.r * Math.PI / 180);
      view.drawLine(-20, -20, 20, 20, 10, hover ? "#0000ff" : (selected ? "#00ff00" : "#ff0000"));
    });
    if (selected) {
      view.drawTransaction((ctx) => {
        ctx.translate(x, y);
          view.drawCircleStroke(
            0,
            0,
            rotateRadius,
            this.isRotating ? rotateActiveColor : (this.isRotatingHover ? rotateHoverColor : rotateColor),
            rotateLineWidth,
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