import { useInstance } from "react-ioc";
import { FloorDto } from "../models/floor.dto";
import "../utils/firebase";
import { IRootService } from "./root-sevice.interface";
import { UserService } from "./user.service";

const endpoint = "https://table-management-3-unsecure.herokuapp.com";

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

      const res = await response.json();
      console.log(`Single plan`);
      console.log(res);
      return this.deserializeFloorPlan(res);

    } catch (error) {
      return {
        data: null,
        plan: null,
      };
    }
  }

  // Update
  public async saveFloorplan(
    id: number | string,
    floorplan: FloorDto,
  ): Promise<FloorDto> {
    const headers = new Headers({
      "Content-Type": "application/json",
    });

    const updatedPlan = this.serializeFloorPlan(floorplan);
    console.log(`Updated plan`);
    console.log(updatedPlan);

    try {
      const response = await fetch(`${endpoint}/floors/floorPlan/${id}`, {
        method: "PUT",
        headers,
        body: JSON.stringify(updatedPlan),
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

  // Remove
  public async deleteFloorplan(id: number | string): Promise<boolean> {
    try {
      const response = await fetch(`${endpoint}/floors/floorPlan/${id}`, {
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
    const headers = new Headers({
      "Content-Type": "application/json",
    });

    const serializedPlan = this.serializeFloorPlan(floorplan);

    try {
      const response = await fetch(`${endpoint}/floors/floorPlan`, {
        method: "POST",
        headers,
        body: JSON.stringify(serializedPlan),
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

  private serializeFloorPlan(floorPlan: FloorDto): FloorDto {
    let floorPlanCopy = JSON.parse(JSON.stringify(floorPlan));
    const cornersArray: any[] = [];

    Object.keys(floorPlanCopy.plan.corners).forEach((key) => {
      floorPlanCopy.plan.corners[key] = {
        id: key,
        ...floorPlanCopy.plan.corners[key],
      };
      cornersArray.push(floorPlanCopy.plan.corners[key]);
    });

    for (let i = 0; i < floorPlanCopy.plan.items.length; i++) {
      floorPlanCopy.plan.items[i] = {
        ...floorPlanCopy.plan.items[i],
        id: i,
      };
    }

    floorPlanCopy = {
      ...floorPlanCopy,
      plan: {
        ...floorPlanCopy.plan,
        corners: cornersArray,
      },
    };

    return floorPlanCopy;
  }

  private arrayToObject(array: {
    [x: string]: { x: number; y: number };
    reduce?: any;
  }) {
    return array.reduce(
      (obj: { [x: string]: any }, item: { id: string | number }) => {
        obj[item.id] = item;
        return obj;
      },
      {},
    );
  }

  private deserializeFloorPlan(floorPlan: FloorDto): FloorDto {
    const cornersObject = this.arrayToObject(floorPlan.plan.corners);

    let floorPlanCopy = JSON.parse(JSON.stringify(floorPlan));

    floorPlanCopy = {
      ...floorPlanCopy,
      plan: {
        ...floorPlanCopy.plan,
        corners: cornersObject,
      },
    };

    return floorPlanCopy;
  }
}
