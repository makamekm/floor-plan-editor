import { FloorplanController } from "./floorplan-controller";
import { FloorplanModel } from "./floorplan-model";
import { Wall } from "./floorplan-entities/wall.model";
import { HalfEdge } from "./floorplan-entities/half-edge.model";
import { Room } from "./floorplan-entities/room.model";
import { Corner } from "./floorplan-entities/corner.model";
import { Configuration, configDpr } from "../utils/configuration";
import { FloorplanMode } from "./floorplan-mode.enum";
import { Item } from "./floorplan-entities/item.model";

// grid parameters
const gridSpacing = 20; // pixels
const gridWidth = 2;
const gridColor = "#f1f1f1";

// room config
const roomColor = "#f9f9f9";

// wall config
const wallWidth = 5;
const wallWidthHover = 7;
const wallColor = "#dddddd"
const wallColorHover = "#008cba"
const edgeColor = "#888888"
const edgeColorHover = "#008cba"
const edgeWidth = 1

const deleteColor = "#ff0000";

// corner config
const cornerRadius = 4
const cornerRadiusHover = 7
const cornerColor = "#888888"
const cornerColorHover = "#2196F3"

/**
 * The View to be used by a Floorplanner to render in/interact with.
 */
export class FloorplanView {

  /** The 2D context. */
  private context: CanvasRenderingContext2D;

  constructor(private floorplan: FloorplanModel, private viewmodel: FloorplanController, private canvasElement: HTMLCanvasElement) {
    this.context = <CanvasRenderingContext2D>this.canvasElement.getContext('2d');

    window.addEventListener('resize', () => {
      this.handleWindowResize();
    });

    this.handleWindowResize();
  }

  public handleWindowResize() {
    const parent = <HTMLElement>this.canvasElement.parentElement;
    const dpr = Configuration.getNumericValue(configDpr);
    this.canvasElement.height = parent.getBoundingClientRect().height * dpr;
    this.canvasElement.width = parent.getBoundingClientRect().width * dpr;
    this.canvasElement.style.transform = `scale(${Math.round(100 / dpr) / 100})`;
    this.canvasElement.style.transformOrigin = "0 0";
    this.canvasElement.getContext("2d").scale(dpr, dpr);
    this.draw();
  }

  public draw() {
    this.context.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);

    this.drawGrid();

    this.floorplan.getRooms().forEach((room) => {
      this.drawRoom(room);
    })

    this.floorplan.getWalls().forEach((wall) => {
      this.drawWall(wall);
    });

    this.floorplan.getCorners().forEach((corner) => {
      this.drawCorner(corner);
    });

    if (this.viewmodel.mode == FloorplanMode.DRAW) {
      this.drawTarget(this.viewmodel.targetX, this.viewmodel.targetY, this.viewmodel.lastNode);
    }

    this.floorplan.getWalls().forEach((wall) => {
      this.drawWallLabels(wall);
    });

    this.floorplan.getItems().forEach((item) => {
      if (this.floorplan.getSelectedItem() !== item) {
        this.drawItem(item);
      }
    });

    if (this.floorplan.getSelectedItem()) {
      this.drawSelectedItem();
    }
  }

  private drawSelectedItem() {
    const item = this.floorplan.getSelectedItem();
    const hover = item === this.viewmodel.activeItem;
    item.render(
      this.viewmodel.convertX(item.x),
      this.viewmodel.convertY(item.y),
      hover,
      true,
      this,
    );
  }

  private drawItem(item: Item) {
    const hover = item === this.viewmodel.activeItem;
    item.render(
      this.viewmodel.convertX(item.x),
      this.viewmodel.convertY(item.y),
      hover,
      false,
      this,
    );
  }

  private drawWallLabels(wall: Wall) {
    // we'll just draw the shorter label... idk
    if (wall.backEdge && wall.frontEdge) {
      if (wall.backEdge.interiorDistance < wall.frontEdge.interiorDistance) {
        this.drawEdgeLabel(wall.backEdge);
      } else {
        this.drawEdgeLabel(wall.frontEdge);
      }
    } else if (wall.backEdge) {
      this.drawEdgeLabel(wall.backEdge);
    } else if (wall.frontEdge) {
      this.drawEdgeLabel(wall.frontEdge);
    }
  }

  private drawWall(wall: Wall) {
    const hover = wall === this.viewmodel.activeWall;
    let color = wallColor;
    if (hover && this.viewmodel.mode == FloorplanMode.DELETE) {
      color = deleteColor;
    } else if (hover) {
      color = wallColorHover;
    }
    this.drawLine(
      this.viewmodel.convertX(wall.getStartX()),
      this.viewmodel.convertY(wall.getStartY()),
      this.viewmodel.convertX(wall.getEndX()),
      this.viewmodel.convertY(wall.getEndY()),
      hover ? wallWidthHover : wallWidth,
      color
    );
    if (!hover && wall.frontEdge) {
      this.drawEdge(wall.frontEdge, hover);
    }
    if (!hover && wall.backEdge) {
      this.drawEdge(wall.backEdge, hover);
    }
  }

  private drawEdgeLabel(edge: HalfEdge) {
    const pos = edge.interiorCenter();
    const length = edge.interiorDistance();
    if (length < 60) {
      // dont draw labels on walls this short
      return;
    }
    this.context.font = "normal 12px Arial";
    this.context.fillStyle = "#000000";
    this.context.textBaseline = "middle";
    this.context.textAlign = "center";
    this.context.strokeStyle = "#ffffff";
    this.context.lineWidth = 4;

    this.context.strokeText(Configuration.cmToMeasure(length),
      this.viewmodel.convertX(pos.x),
      this.viewmodel.convertY(pos.y));

    this.context.fillText(Configuration.cmToMeasure(length),
      this.viewmodel.convertX(pos.x),
      this.viewmodel.convertY(pos.y));
  }

  private drawEdge(edge: HalfEdge, hover: boolean) {
    let color = edgeColor;
    if (hover && this.viewmodel.mode == FloorplanMode.DELETE) {
      color = deleteColor;
    } else if (hover) {
      color = edgeColorHover;
    }
    const corners = edge.corners();

    this.drawPolygon(
      corners.map(corner => {
        return this.viewmodel.convertX(corner.x);
      }),
      corners.map(corner => {
        return this.viewmodel.convertY(corner.y);
      }),
      false,
      undefined,
      true,
      color,
      edgeWidth
    );
  }

  private drawRoom(room: Room) {
    this.drawPolygon(
      room.corners.map(corner => {
        return this.viewmodel.convertX(corner.x);
      }),
      room.corners.map(corner =>  {
        return this.viewmodel.convertY(corner.y);
      }),
      true,
      roomColor
    );
  }

  private drawCorner(corner: Corner) {
    const hover = (corner === this.viewmodel.activeCorner);
    let color = cornerColor;
    if (hover && this.viewmodel.mode == FloorplanMode.DELETE) {
      color = deleteColor;
    } else if (hover) {
      color = cornerColorHover;
    }
    this.drawCircle(
      this.viewmodel.convertX(corner.x),
      this.viewmodel.convertY(corner.y),
      hover ? cornerRadiusHover : cornerRadius,
      color
    );
  }

  private drawTarget(x: number, y: number, lastNode: Corner | null = null) {
    this.drawCircle(
      this.viewmodel.convertX(x),
      this.viewmodel.convertY(y),
      cornerRadiusHover,
      cornerColorHover
    );
    if (lastNode) {
      this.drawLine(
        this.viewmodel.convertX(lastNode.x),
        this.viewmodel.convertY(lastNode.y),
        this.viewmodel.convertX(x),
        this.viewmodel.convertY(y),
        wallWidthHover,
        wallColorHover
      );
    }
  }

  /** returns n where -gridSize/2 < n <= gridSize/2  */
  private calculateGridOffset(n: number) {
    if (n >= 0) {
      return (n + gridSpacing / 2.0) % gridSpacing - gridSpacing / 2.0;
    } else {
      return (n - gridSpacing / 2.0) % gridSpacing + gridSpacing / 2.0;
    }
  }

  private drawGrid() {
    const offsetX = this.calculateGridOffset(-this.viewmodel.originX);
    const offsetY = this.calculateGridOffset(-this.viewmodel.originY);
    const width = this.canvasElement.width;
    const height = this.canvasElement.height;
    for (let x = 0; x <= (width / gridSpacing); x++) {
      this.drawLine(gridSpacing * x + offsetX, 0, gridSpacing * x + offsetX, height, gridWidth, gridColor);
    }
    for (let y = 0; y <= (height / gridSpacing); y++) {
      this.drawLine(0, gridSpacing * y + offsetY, width, gridSpacing * y + offsetY, gridWidth, gridColor);
    }
  }

  public drawLine(
    startX: number,
    startY: number,
    endX: number,
    endY: number,
    width: number,
    color: string,
  ) {
    // width is an integer
    // color is a hex string, i.e. #ff0000
    this.context.beginPath();
    this.context.moveTo(startX, startY);
    this.context.lineTo(endX, endY);
    this.context.lineWidth = width;
    this.context.strokeStyle = color;
    this.context.stroke();
  }

  public drawPolygon(
    xArr: number[],
    yArr: number[],
    fill: boolean,
    fillColor?: string,
    stroke?: boolean,
    strokeColor?: string,
    strokeWidth?: number,
  ) {
    // fillColor is a hex string, i.e. #ff0000
    fill = fill || false;
    stroke = stroke || false;
    this.context.beginPath();
    this.context.moveTo(xArr[0], yArr[0]);
    for (let i = 1; i < xArr.length; i++) {
      this.context.lineTo(xArr[i], yArr[i]);
    }
    this.context.closePath();
    if (fill) {
      this.context.fillStyle = <string>fillColor;
      this.context.fill();
    }
    if (stroke) {
      this.context.lineWidth = <number>strokeWidth;
      this.context.strokeStyle = <string>strokeColor;
      this.context.stroke();
    }
  }

  public drawCircle(centerX: number, centerY: number, radius: number, fillColor: string) {
    this.context.beginPath();
    this.context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
    this.context.fillStyle = fillColor;
    this.context.fill();
  }

  public drawCircleStroke(centerX: number, centerY: number, radius: number, fillColor: string, lineWidth: number) {
    this.context.beginPath();
    this.context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
    this.context.strokeStyle = fillColor;
    this.context.lineWidth = lineWidth;
    this.context.stroke();
  }

  public drawTransaction(render: (ctx: CanvasRenderingContext2D, floorplanner: FloorplanController, floorplan: FloorplanModel) => void) {
    this.context.save();
    render(this.context, this.viewmodel, this.floorplan);
    this.context.restore();
  }

  public drawLabel(x: number, y: number, text: string) {
    this.context.font = "normal 12px Arial";
    this.context.fillStyle = "#000000";
    this.context.textBaseline = "middle";
    this.context.textAlign = "center";
    this.context.strokeStyle = "#ffffff";
    this.context.lineWidth = 4;

    this.context.strokeText(text,
      this.viewmodel.convertX(x),
      this.viewmodel.convertY(y),
    );

    this.context.fillText(text,
      this.viewmodel.convertX(x),
      this.viewmodel.convertY(y),
    );
  }
}