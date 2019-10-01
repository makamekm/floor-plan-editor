import firebase from "firebase/app";
import { useInstance } from "react-ioc";
import { FloorDto } from "../models/floor.dto";
import { ProjectDto, ProjectListDto } from "../models/project-list.dto";
import "../utils/firebase";
import { IRootService } from "./root-sevice.interface";
import { UserService } from "./user.service";

export class FloorProvider implements IRootService {
  public userService: UserService;

  public useHook() {
    this.userService = useInstance(UserService);
  }

  public async getFloorplan(projectId: number | string, id: number | string): Promise<FloorDto> {
    const db = firebase.firestore();
    const floorplanRef = db.collection("floorplan");

    const floorplan = await floorplanRef
      .doc(String(id)).get();

    if (floorplan.exists) {
      return {
        id: floorplan.id,
        ...floorplan.data() as FloorDto,
      };
    } else {
      return {
        data: null,
        plan: null,
      };
    }
  }

  public async saveFloorplan(projectId: number | string, id: number | string, floorplan: FloorDto): Promise<FloorDto> {
    const db = firebase.firestore();
    const projectRef = db.collection("floorplan");

    await projectRef
      .doc(String(id))
      .update({
        projectId,
        userId: this.userService.user.uid,
        ...floorplan,
      });

    return floorplan;
  }

  public async getFloorplanList(projectId: number | string): Promise<FloorDto[]> {
    const db = firebase.firestore();
    const projectRef = db.collection("floorplan");

    const project = await projectRef
      .where("projectId", "==", projectId)
      .get();

    return project.docs.map((d) => ({
      id: d.id,
      ...d.data() as FloorDto,
    }));
  }

  public async deleteFloorplan(projectId: number | string, id: number | string): Promise<boolean> {
    const db = firebase.firestore();
    const projectRef = db.collection("floorplan");
    await projectRef.doc(String(id)).delete();
    return true;
  }

  public async createFloorplan(projectId: number | string, floorplan: FloorDto): Promise<FloorDto> {
    const db = firebase.firestore();
    const projectRef = db.collection("floorplan");
    const ref = await projectRef.add({
      projectId,
      userId: this.userService.user.uid,
      ...floorplan,
    });
    return {
      ...floorplan,
      id: ref.id,
    };
  }

  public async getProject(projectId: number | string): Promise<ProjectDto> {
    const db = firebase.firestore();
    const projectRef = db.collection("project");

    const project = await projectRef
      .doc(String(projectId)).get();

    if (project.exists) {
      return {
        id: project.id,
        ...project.data() as ProjectDto,
      };
    } else {
      return null;
    }
  }

  public async getProjectList(): Promise<ProjectListDto> {
    const db = firebase.firestore();
    const projectRef = db.collection("project");

    const project = await projectRef
      .where("userId", "==", this.userService.user.uid)
      .get();
    return project.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    } as any));
  }

  public async deleteProject(projectId: number | string): Promise<boolean> {
    const db = firebase.firestore();
    const projectRef = db.collection("project");
    await projectRef.doc(String(projectId)).delete();
    return true;
  }

  public async saveProject(project: ProjectDto): Promise<ProjectDto> {
    const db = firebase.firestore();
    const projectRef = db.collection("project");

    await projectRef
      .doc(String(project.id))
      .update({
        userId: this.userService.user.uid,
        ...project,
      });

    return project;
  }

  public async createProject(name: string): Promise<ProjectDto> {
    const db = firebase.firestore();
    const projectRef = db.collection("project");
    const ref = await projectRef.add({
      userId: this.userService.user.uid,
      name,
    });
    return {
      name,
      id: ref.id,
    };
  }
}
