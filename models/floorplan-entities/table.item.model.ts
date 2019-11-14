import { Utils } from "../../utils/operations";
import { FloorplanMode } from "../floorplan-mode.enum";
import { FloorplanModel } from "../floorplan-model";
import { FloorplanView } from "../floorplan-view";
import { Item, ItemMetadata } from "./item.model";

const tableHeight = 60;
const tableWidth = 30;
const tableColorFree = "#10e04e";
const tableColorAssigned = "#fce303";
const tableColorHover = "#F1FCFF";
const tableColorActive = "#F1FCFF";
const tableEdgeColor = "#888888";
const tableEdgeColorHover = "#888888";
const tableEdgeColorActive = "#888888";
const tableEdgeWidth = 1;

const rotateRadius = 100;
const rotateLineWidth = 10;
const rotateColor = "#888888";
const rotateHoverColor = "#2196F3";
const rotateActiveColor = "#2196F3";

const tableTextLimit = 14;

export class TableItem extends Item {

  public isRotating = false;
  public isRotatingHover = false;

  constructor(
    floorplan: FloorplanModel,
    x: number,
    y: number,
    metadata: ItemMetadata,
  ) {
    super(floorplan, x, y, metadata);
    this.metadata.height = this.metadata.height || 0;
    this.metadata.width = this.metadata.width || 0;
  }

  public mousedown(x: number, y: number, scale: number) {
    const isRotating = this.overlappedRotate(x, y, scale);
    if (isRotating !== this.isRotating) {
      this.isRotating = isRotating;
    }
  }

  public startActive(): void {
    // Skip
  }
  public endActive(): void {
    this.isRotating = false;
    this.isRotatingHover = false;
  }
  public mouseup(x: number, y: number) {
    if (this.isRotating) {
      this.isRotating = false;
      this.roundAngle();
      return true;
    }
  }

  public mousemove(
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

  public render(
    x: number,
    y: number,
    scale: number,
    hover: boolean,
    selected: boolean,
    mode: FloorplanMode,
    view: FloorplanView,
  ): void {

    // tslint:disable-next-line: max-line-length
    const fillColor = hover ? tableColorHover : (selected ? tableColorActive : this.metadata.name ? tableColorAssigned : tableColorFree);
    const edgeColor = hover ? tableEdgeColorHover : (selected ? tableEdgeColorActive : tableEdgeColor);
    view.drawTransaction((ctx) => {
      ctx.translate(x, y);
      ctx.rotate(this.getClosestAngle() * Math.PI / 180);
      view.drawPolygon([
        -tableWidth / 2/scale,
        tableWidth / 2/scale,
        tableWidth / 2/scale,
        -tableWidth / 2/scale,
      ], [
        -tableHeight / 2/scale,
        -tableHeight / 2/scale,
        tableHeight / 2/scale,
        tableHeight / 2/scale,
      ], true, fillColor, true, edgeColor, tableEdgeWidth);
      view.drawLine(
        -tableWidth / 2/scale,
        -tableHeight / 2/scale,
        tableWidth / 2/scale,
        tableHeight / 2/scale,
        tableEdgeWidth,
        edgeColor,
      );
      view.drawLine(
        tableWidth / 2/scale,
        -tableHeight / 2/scale,
        -tableWidth / 2/scale,
        tableHeight / 2/scale,
        tableEdgeWidth,
        edgeColor,
      );
    });
    if (selected && mode === FloorplanMode.MOVE) {
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

    // TO CHANGE

    if (this.metadata.name && !this.metadata.description) {
      view.drawLabel(this.x, this.y, this.limitText(this.metadata.name));
    } else {
      view.drawLabel(this.x, this.y + 15, this.limitText(this.metadata.name));
    }
    if (!this.metadata.name && this.metadata.description) {
      view.drawLabel(this.x, this.y, this.limitText(this.metadata.description));
    } else {
      view.drawLabel(this.x, this.y - 15, this.limitText(this.metadata.description));
    }

  }

  public limitText(text: string) {
    if (text.length > tableTextLimit) {
      return text.substr(0, tableTextLimit) + "...";
    } else {
      return text;
    }
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
    let { x, y } = this.rotateVector(rawX - this.x / scale, rawY - this.y / scale, this.metadata.r);
    const sens = 5;
    const isMainHover = x <= (tableWidth + sens) && x >= (-tableWidth - sens)
      && y <= (tableHeight + sens) && y >= (-tableHeight - sens);
    if (selected && mode === FloorplanMode.MOVE) {
      this.isRotatingHover = this.overlappedRotate(rawX, rawY, scale);
      return isMainHover || this.isRotatingHover;
    } else {
      return isMainHover;
    }
  }

  private overlappedRotate(x: number, y: number, scale: number): boolean {
    const dist = Utils.pointDistance(this.x / scale, this.y / scale, x, y);
    return dist > rotateRadius * 2 - rotateLineWidth
      && dist < rotateRadius * 2 + rotateLineWidth;
  }

  private getClosestAngle(sens = 5) {
    return Utils.findClosestAngle(this.metadata.r, [15, 45], sens);
  }

  private roundAngle() {
    this.metadata.r = this.getClosestAngle();
  }
}
