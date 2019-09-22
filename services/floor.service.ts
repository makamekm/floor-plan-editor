import { useRouter } from "next/router";
import { observable } from "mobx";
import debounce from "debounce";
import { inject } from "react-ioc";
import { FloorProvider } from "./floor.provider";
import { FloorplanDataDto, FloorplanDto } from "../models/floor.dto";
import { BlueprintService } from "./blueprint.service";
import { FloorListService } from "./floor-list.service";

export class FloorService {
  @observable loading: boolean = false;

  private setLoading = debounce<(value: boolean) => void>(value => {
    this.loading = value;
  }, 50);

  @observable floor: {
    data: FloorplanDataDto;
    plan: FloorplanDto;
  } = {
    data: null,
    plan: null,
  };

  @inject(FloorProvider) private floorProvider: FloorProvider;
  @inject(FloorListService) private floorListService: FloorListService;
  @inject(BlueprintService) private blueprintService: BlueprintService;
  private router = useRouter();

  constructor() {
    if (process.browser) {
      if (this.router.query.id != null) {
        this.loadFloor(Number.parseInt(<string>this.router.query.id, 10));
      }
    }
  }

  public async loadFloor(id: number) {
    this.setLoading(true);
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
      this.blueprintService.setFloorplan(plan);
    } catch (error) {
      console.error(error);
    } finally {
      this.setLoading(false);
    }
  }

  public openFloor(id: number) {
    this.router.push('/' + String(id));
    this.loadFloor(id);
  }

  public async saveFloor() {
    this.setLoading(true);
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
      await this.floorListService.loadList();
    } catch (error) {
      console.error(error);
    } finally {
      this.setLoading(false);
    }
  }

  public async createFloor(name: string) {
    this.setLoading(true);
    try {
      const data = await this.floorProvider.createFloorplan(name, this.floor.plan);
      this.router.push('/' + String(data.id));
    } catch (error) {
      console.error(error);
    } finally {
      this.setLoading(false);
    }
  }

  public async deleteFloor(id: number) {
    this.setLoading(true);
    try {
      const result = await this.floorProvider.deleteFloorPlan(id);
      if (result) {
        await this.floorListService.loadList();
        if (this.floor.data.id === id) {
          this.router.push('/');
          this.floor.plan = null;
          this.floor.data = null;
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      this.setLoading(false);
    }
  }
}