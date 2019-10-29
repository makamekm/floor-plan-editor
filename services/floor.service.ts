import debounce from "debounce";
import { observable } from "mobx";
import { NextRouter, useRouter } from "next/router";
import { useInstance } from "react-ioc";
import { FloorDto, FloorplanDataDto } from "../models/floor.dto";
import { useRouterChange } from "../utils/router-hook";
import { BlueprintService } from "./blueprint.service";
import { FloorListService } from "./floor-list.service";
import { FloorRouterService } from "./floor-router.service";
import { FloorProvider } from "./floor.provider";
import { IRootService } from "./root-sevice.interface";

export class FloorService implements IRootService {
  @observable public loading: boolean = false;

  @observable public floor: {
    id?: number | string;
    data: FloorplanDataDto;
  } = {
    id: null,
    data: null,
  };

  public saveState = debounce(() => {
    if (this.floor.id != null) {
      const floor: FloorDto = {
        id: this.floor.id,
        data: this.floor.data,
        plan: this.blueprintService.getFloorplan(),
      };
      this.saveFloor(floor);
    }
  }, 1000);

  private setLoading = debounce<(value: boolean) => void>((value) => {
    this.loading = value;
  }, 50);

  private router: NextRouter;
  private floorProvider: FloorProvider;
  private floorRouterService: FloorRouterService;
  private blueprintService: BlueprintService;
  private floorListService: FloorListService;

  public useHook() {
    this.router = useRouter();
    this.floorProvider = useInstance(FloorProvider);
    this.floorRouterService = useInstance(FloorRouterService);
    this.blueprintService = useInstance(BlueprintService);
    this.floorListService = useInstance(FloorListService);
    useRouterChange(this.onRouterChange);
  }

  public onRouterChange = () => {
    this.floorListService.loadList();

    if (this.router.query.id != null) {
      this.loadFloor(String(this.router.query.id));
    } else {
      this.floor.id = null;
      this.blueprintService.setFloorplan(null);
    }
  }

  public async loadFloor(id: string | number) {
    this.setLoading(true);
    try {
      const floor = await this.floorProvider.getFloorplan(id);
      this.floor = floor;
      this.blueprintService.setFloorplan(floor.plan);
    } catch (error) {
      // tslint:disable-next-line
      console.error(error);
    } finally {
      this.setLoading(false);
    }
  }

  public async saveFloor(floor: FloorDto) {
    // this.setLoading(true);
    try {
      await this.floorProvider.saveFloorplan(
        floor.id,
        {
          data: floor.data,
          plan: floor.plan,
        },
      );
      await this.floorListService.loadList();
    } catch (error) {
      // tslint:disable-next-line
      console.error(error);
    } finally {
      // this.setLoading(false);
    }
  }

  public async createFloor(name: string) {
    this.setLoading(true);
    try {
      const plan = this.blueprintService.getFloorplan();
      if (plan) {
        const data = await this.floorProvider.createFloorplan(
          {
            data: {
              name,
            },
            plan,
          },
        );
        await this.floorListService.loadList();
        this.floorRouterService.openFloor(data.id);
      } else {
        alert("Please draw something");
      }
    } catch (error) {
      // tslint:disable-next-line
      console.error(error);
    } finally {
      this.setLoading(false);
    }
  }

  public async deleteFloor(id: number | string = this.floor.id) {
    this.setLoading(true);
    try {
      const result = await this.floorProvider.deleteFloorplan(
        id,
      );
      if (result) {
        await this.floorListService.loadList();
        if (this.floor.id === id) {
          this.floorRouterService.openHome();
          this.floor.id = null;
          this.floor.data = null;
        }
      }
    } catch (error) {
      // tslint:disable-next-line
      console.error(error);
    } finally {
      this.setLoading(false);
    }
  }
}
