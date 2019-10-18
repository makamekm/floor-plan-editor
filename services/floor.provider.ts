import { useInstance } from "react-ioc";
import { FloorDto } from "../models/floor.dto";
import "../utils/firebase";
import { IRootService } from "./root-sevice.interface";
import { UserService } from "./user.service";

const endpoint = "http://table-management-3-unsecure.herokuapp.com";

export class FloorProvider implements IRootService {
  public userService: UserService;

  public useHook() {
    this.userService = useInstance(UserService);
  }

  // Get single plan
  public async getFloorplan(id: number | string): Promise<FloorDto> {
    try {
      const response = await fetch(`${endpoint}/floors/floorPlan/${id}`);

      if (!response.ok) {
        throw Error(response.statusText);
      }

      return await response.json();
    } catch (error) {
      return {
        data: null,
        plan: null,
      };
    }
  }

  // Update
  public async saveFloorplan(id: number | string, floorplan: FloorDto): Promise<FloorDto> {
    try {
      const response = await fetch(`${endpoint}/floors/floorPlan/${id}`, {
        method: "PUT",
        body: JSON.stringify(floorplan),
      });

      if (!response.ok) {
        throw Error(response.statusText);
      }

      return await response.json();
    } catch (error) {
      return {
        data: null,
        plan: null,
      };
    }
  }

  // Get
  public async getFloorplanList(): Promise<FloorDto[]> {

    try {
      const response = await fetch(`${endpoint}/floors/floorPlanList`);

      if (!response.ok) {
        throw Error(response.statusText);
      }

      return await response.json();
    } catch (error) {
      return [];
    }
  }

  public async deleteFloorplan(id: number | string): Promise<boolean> {
    try {
      const response = await fetch(`${endpoint}/floors/floorPlanList/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw Error(response.statusText);
      }

      return true;
    } catch (error) {
      return false;
    }
  }

  // Post
  public async createFloorplan(floorplan: FloorDto): Promise<FloorDto> {
    try {
      const response = await fetch(`${endpoint}/floors/floorPlanList`, {
        method: "POST",
        body: JSON.stringify(floorplan),
      });

      if (!response.ok) {
        throw Error(response.statusText);
      }

      return await response.json();
    } catch (error) {
      return {
        data: null,
        plan: null,
      };
    }
  }
}
