import firebase from "firebase/app";
import { useInstance } from "react-ioc";
import { FloorDto } from "../models/floor.dto";
import "../utils/firebase";
import { IRootService } from "./root-sevice.interface";
import { UserService } from "./user.service";

const endpoint = "http://table-management-staging.herokuapp.com/"

export class FloorProvider implements IRootService {
  public userService: UserService;

  public useHook() {
    this.userService = useInstance(UserService);
  }

  public async getFloorplan(id: number | string): Promise<FloorDto> {
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

  public async saveFloorplan(id: number | string, floorplan: FloorDto): Promise<FloorDto> {
    const db = firebase.firestore();
    const projectRef = db.collection("floorplan");

    await projectRef
      .doc(String(id))
      .update({
        userId: this.userService.user.uid,
        ...floorplan,
      });

    return floorplan;
  }

  public async getFloorplanList(): Promise<FloorDto[]> {
    const db = firebase.firestore();
    const projectRef = db.collection("floorplan");

    const project = await projectRef
      .get();

    return project.docs.map((d) => ({
      id: d.id,
      ...d.data() as FloorDto,
    }));
  }

  public async deleteFloorplan(id: number | string): Promise<boolean> {
    const db = firebase.firestore();
    const projectRef = db.collection("floorplan");
    await projectRef.doc(String(id)).delete();
    return true;
  }

  public async createFloorplan(floorplan: FloorDto): Promise<FloorDto> {
    const db = firebase.firestore();
    const projectRef = db.collection("floorplan");
    const ref = await projectRef.add({
      userId: this.userService.user.uid,
      ...floorplan,
    });
    return {
      ...floorplan,
      id: ref.id,
    };
  }
}
