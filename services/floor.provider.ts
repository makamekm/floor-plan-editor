import { FloorplanDto, FloorplanDataDto } from "../models/floor.dto";
import { FloorplanListDto } from "../models/floor-list.dto";
import { demoFloorData, demoPlan, demoFloorList, demoProjectList, demoProject } from "./floot.demo";
import { ProjectListDto, ProjectListItemDto, ProjectDto } from "../models/project-list.dto";

export class FloorProvider {
  public async getFloorplanData(projectId: number, id: number): Promise<FloorplanDataDto>{
    await new Promise(r => setTimeout(r, 1000));
    return JSON.parse(JSON.stringify(demoFloorData));
  }

  public async getFloorplan(projectId: number, id: number): Promise<FloorplanDto>{
    await new Promise(r => setTimeout(r, 1000));
    return JSON.parse(JSON.stringify(demoPlan));
  }

  public async saveFloorplanData(projectId: number, id: number, data: FloorplanDataDto): Promise<FloorplanDataDto>{
    await new Promise(r => setTimeout(r, 1000));
    return JSON.parse(JSON.stringify(data));
  }

  public async saveFloorPlan(projectId: number, id: number, floorplan: FloorplanDto): Promise<FloorplanDto>{
    await new Promise(r => setTimeout(r, 1000));
    return JSON.parse(JSON.stringify(floorplan));
  }

  public async getFloorList(projectId: number): Promise<FloorplanListDto>{
    await new Promise(r => setTimeout(r, 1000));
    return JSON.parse(JSON.stringify(demoFloorList));
  }

  public async deleteFloorPlan(projectId: number, id: number): Promise<boolean>{
    await new Promise(r => setTimeout(r, 1000));
    return true;
  }

  public async createFloorplan(projectId: number, name: string, floorplan: FloorplanDto): Promise<FloorplanDataDto>{
    await new Promise(r => setTimeout(r, 1000));
    return JSON.parse(JSON.stringify({ name, id: 1 }));
  }

  public async getProject(projectId: number): Promise<ProjectDto>{
    await new Promise(r => setTimeout(r, 1000));
    return JSON.parse(JSON.stringify(demoProject));
  }

  public async getProjectList(): Promise<ProjectListDto>{
    await new Promise(r => setTimeout(r, 1000));
    return JSON.parse(JSON.stringify(demoProjectList));
  }

  public async deleteProject(projectId: number): Promise<boolean>{
    await new Promise(r => setTimeout(r, 1000));
    return true;
  }

  public async saveProject(project: ProjectDto): Promise<ProjectDto>{
    await new Promise(r => setTimeout(r, 1000));
    return JSON.parse(JSON.stringify(project));
  }

  public async createProject(name: string): Promise<ProjectDto>{
    await new Promise(r => setTimeout(r, 1000));
    return JSON.parse(JSON.stringify({ name, id: 0 }));
  }
}