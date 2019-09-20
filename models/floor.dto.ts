
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
}

export interface FloorplanDataDto {
  id: number;
  name: string;
  items: {
    id: number;
    name: string;
    description: string;
    type: number;
    x: number;
    y: number;
  }[];
}