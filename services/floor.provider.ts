import { FloorplanDto, FloorplanDataDto } from "../models/floor.dto";
import { FloorplanListDto } from "../models/floor-list.dto";
import { demoFloorData, demoPlan, demoFloorList } from "./floot.demo";

export class FloorProvider {
  public async getFloorplanData(id: number): Promise<FloorplanDataDto>{
    await new Promise(r => setTimeout(r, 1000));
    return JSON.parse(JSON.stringify(demoFloorData));
  }

  public async getFloorplan(id: number): Promise<FloorplanDto>{
    await new Promise(r => setTimeout(r, 1000));
    return JSON.parse(JSON.stringify(demoPlan));
  }

  public async saveFloorplanData(id: number, data: FloorplanDataDto): Promise<FloorplanDataDto>{
    await new Promise(r => setTimeout(r, 1000));
    return JSON.parse(JSON.stringify(data));
  }

  public async saveFloorPlan(id: number, floorplan: FloorplanDto): Promise<FloorplanDto>{
    await new Promise(r => setTimeout(r, 1000));
    return JSON.parse(JSON.stringify(floorplan));
  }

  public async getFloorList(): Promise<FloorplanListDto>{
    await new Promise(r => setTimeout(r, 1000));
    return JSON.parse(JSON.stringify(demoFloorList));
  }

  public async deleteFloorPlan(id: number): Promise<boolean>{
    await new Promise(r => setTimeout(r, 1000));
    return true;
  }
}