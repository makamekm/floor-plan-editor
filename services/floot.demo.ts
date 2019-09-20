import { FloorplanDto, FloorplanDataDto } from "../models/floor.dto";
import { FloorplanListDto } from "../models/floor-list.dto";

export const demoPlan: FloorplanDto = {
  corners: {
    "f90da5e3-9e0e-eba7-173d-eb0b071e838e": {
      x: 300,
      y: 300
    },
    "da026c08-d76a-a944-8e7b-096b752da9ed": {
      x: 600,
      y: 300
    },
    "4e3d65cb-54c0-0681-28bf-bddcc7bdb571": {
      x: 600,
      y: 600
    },
    "71d4f128-ae80-3d58-9bd2-711c6ce6cdf2": {
      x: 300,
      y: 600
    }
  },
  walls: [
    {
      corner1: "71d4f128-ae80-3d58-9bd2-711c6ce6cdf2",
      corner2: "f90da5e3-9e0e-eba7-173d-eb0b071e838e"
    },
    {
      corner1: "f90da5e3-9e0e-eba7-173d-eb0b071e838e",
      corner2: "da026c08-d76a-a944-8e7b-096b752da9ed"
    },
    {
      corner1: "da026c08-d76a-a944-8e7b-096b752da9ed",
      corner2: "4e3d65cb-54c0-0681-28bf-bddcc7bdb571"
    },
    {
      corner1: "4e3d65cb-54c0-0681-28bf-bddcc7bdb571",
      corner2: "71d4f128-ae80-3d58-9bd2-711c6ce6cdf2"
    }
  ],
  items: [
    {
      name: 'test',
      description: 'sdfsdfsd',
      type: 0,
      x: 400,
      y: 400,
    }
  ],
};

export const demoFloorData: FloorplanDataDto = {
  id: 1,
  name: "Floor 2 (Kitchen)",
};

export const demoFloorList: FloorplanListDto = [
  {
    id: 0,
    name: "Floor 1 (Work)"
  },
  {
    id: 1,
    name: "Floor 2 (Kitchen)"
  },
  {
    id: 2,
    name: "Floor 3 (Server)"
  },
];
