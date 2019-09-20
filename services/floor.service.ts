import { FloorplanListItemDto } from "../models/floor-list.dto";
import { useRouter } from "next/router";
import { observable, IObservableArray, computed } from "mobx";
import { inject } from "react-ioc";
import { FloorProvider } from "./floor.provider";
import { FloorplanDataDto, FloorplanDto } from "../models/floor.dto";

export class FloorService {
  @observable loadingList: boolean = true;
  @observable loadingFloor: boolean = false;
  @computed loading() {
    return this.loadingFloor && this.loadingList;
  };

  @observable list: IObservableArray<FloorplanListItemDto> = <any>[];
  @observable floor: {
    data: FloorplanDataDto;
    plan: FloorplanDto;
  } = {
    data: null,
    plan: null,
  };

  @inject(FloorProvider) private floorProvider: FloorProvider;
  private router = useRouter();

  constructor() {
    if (process.browser) {
      this.loadList();

      if (this.router.query.id != null) {
        this.loadFloor(Number.parseInt(<string>this.router.query.id, 10));
      }
    }
  }

  public async loadFloor(id: number) {
    this.loadingFloor = true;
    try {
      const [plan, data]: [
        FloorplanDto,
        FloorplanDataDto,
      ] = await Promise.all([
        this.floorProvider.getFloorplan(id),
        this.floorProvider.getFloorplanData(id),
      ]);
      this.floor.plan = plan;
      this.floor.data = data;
      console.log(this.floor.plan, this.floor.data);
    } catch (error) {
      console.error(error);
    } finally {
      this.loadingFloor = false;
    }
  }

  public openFloor(id: number) {
    this.router.push('/' + String(id));
    this.loadFloor(id);
  }

  public async loadList() {
    this.loadingList = true;
    try {
      const list = await this.floorProvider.getFloorList();
      this.list.replace(list);
      console.log(this.list);
    } catch (error) {
      console.error(error);
    } finally {
      this.loadingList = false;
    }
  }

  public async saveFloor() {
    this.loadingFloor = true;
    try {
      const [plan, data]: [
        FloorplanDto,
        FloorplanDataDto,
      ] = await Promise.all([
        this.floorProvider.saveFloorPlan(this.floor.data.id, this.floor.plan),
        this.floorProvider.saveFloorplanData(this.floor.data.id, this.floor.data),
      ]);
      this.floor.plan = plan;
      this.floor.data = data;
      await this.loadList();
      console.log(this.floor.plan, this.floor.data);
    } catch (error) {
      console.error(error);
    } finally {
      this.loadingFloor = false;
    }
  }

  public async deleteFloor(id: number) {
    this.loadingFloor = true;
    try {
      const result = await this.floorProvider.deleteFloorPlan(id);
      if (result) {
        await this.loadList();
        if (this.floor.data.id === id) {
          this.router.push('/');
          this.floor.plan = null;
          this.floor.data = null;
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      this.loadingFloor = false;
    }
  }
}