import { ItemEnum } from "./floorplan-entities/item.enum";

export interface FloorplanDto {
  corners: {
    [id: string]: {
      x: number;
      y: number;
    }
  };
  walls: {
    corner1: string;
    corner2: string;
  }[];
  items: FloorplanItemDto[];
}

export interface FloorplanItemDto {
  id: number | string;
  name: string;
  description: string;
  type: ItemEnum;
  x: number;
  y: number;
  r: number;
}

export interface FloorplanDataDto {
  name: string;
}

export interface FloorDto {
  id?: number | string;
  data: FloorplanDataDto;
  plan: FloorplanDto;
}
