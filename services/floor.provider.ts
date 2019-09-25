import { FloorplanDto, FloorplanDataDto } from "../models/floor.dto";
import { FloorplanListDto } from "../models/floor-list.dto";
import { demoFloorData, demoPlan, demoFloorList, demoProjectList, demoProject } from "./floot.demo";
import { ProjectListDto, ProjectDto } from "../models/project-list.dto";
import '../utils/firebase';
import firebase from 'firebase/app';

export class FloorProvider {
  public async getFloorplanData(projectId: number | string, id: number | string): Promise<FloorplanDataDto>{
    await new Promise(r => setTimeout(r, 1000));
    return JSON.parse(JSON.stringify(demoFloorData));
  }

  public async getFloorplan(projectId: number | string, id: number | string): Promise<FloorplanDto>{
    await new Promise(r => setTimeout(r, 1000));
    return JSON.parse(JSON.stringify(demoPlan));
  }

  public async saveFloorplanData(projectId: number | string, id: number | string, data: FloorplanDataDto): Promise<FloorplanDataDto>{
    await new Promise(r => setTimeout(r, 1000));
    return JSON.parse(JSON.stringify(data));
  }

  public async saveFloorPlan(projectId: number | string, id: number | string, floorplan: FloorplanDto): Promise<FloorplanDto>{
    await new Promise(r => setTimeout(r, 1000));
    return JSON.parse(JSON.stringify(floorplan));
  }

  public async getFloorList(projectId: number | string): Promise<FloorplanListDto>{
    await new Promise(r => setTimeout(r, 1000));
    return JSON.parse(JSON.stringify(demoFloorList));
  }

  public async deleteFloorPlan(projectId: number | string, id: number | string): Promise<boolean>{
    await new Promise(r => setTimeout(r, 1000));
    return true;
  }

  public async createFloorplan(projectId: number | string, name: string, floorplan: FloorplanDto): Promise<FloorplanDataDto>{
    await new Promise(r => setTimeout(r, 1000));
    return JSON.parse(JSON.stringify({ name, id: 1 }));
  }

  public async getProject(projectId: number | string): Promise<ProjectDto>{
    await new Promise(r => setTimeout(r, 1000));
    return JSON.parse(JSON.stringify(demoProject));
  }

  public async getProjectList(): Promise<ProjectListDto>{
    // await new Promise(r => setTimeout(r, 1000));
    const db = firebase.firestore();
    const projectsRef = db.collection('projects');
    const projects = await projectsRef.get();
    console.log(projects.docs);
    return JSON.parse(JSON.stringify(demoProjectList));
  }

  public async deleteProject(projectId: number | string): Promise<boolean>{
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