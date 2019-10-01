import debounce from "debounce";
import { observable } from "mobx";
import { NextRouter, useRouter } from "next/router";
import { useInstance } from "react-ioc";
import { FloorDto, FloorplanDataDto } from "../models/floor.dto";
import { useCallback } from "../utils/callback";
import { useRouterChange } from "../utils/router-hook";
import { BlueprintService } from "./blueprint.service";
import { FloorRouterService } from "./floor-router.service";
import { FloorProvider } from "./floor.provider";
import { ProjectService } from "./project.service";
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
  private projectService: ProjectService;
  private blueprintService: BlueprintService;

  public useHook() {
    this.router = useRouter();
    this.floorProvider = useInstance(FloorProvider);
    this.floorRouterService = useInstance(FloorRouterService);
    this.projectService = useInstance(ProjectService);
    this.blueprintService = useInstance(BlueprintService);
    useRouterChange(this.onRouterChange);
    useCallback(this.blueprintService.onStateChange, () => {
      this.saveState();
    });
  }

  public onRouterChange = () => {
    if (this.router.query.id != null) {
      this.loadFloor(String(this.router.query.id));
    } else {
      this.floor.id = null;
      this.blueprintService.setFloorplan(null);
    }
  }

  public async loadFloor(id: string | number) {
    this.setLoading(true);
    await this.projectService.loadProject(this.projectService.project.id);
    try {
      const floor = await this.floorProvider.getFloorplan(this.projectService.project.id, id);
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
        this.projectService.project.id,
        floor.id,
        {
          data: floor.data,
          plan: floor.plan,
        },
      );
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
          this.projectService.project.id,
          {
            data: {
              name,
            },
            plan,
          },
        );
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
        this.projectService.project.id,
        id,
      );
      if (result) {
        await this.projectService.loadProject(this.projectService.project.id);
        if (this.floor.id === id) {
          this.floorRouterService.openProject(
            this.projectService.project.id,
          );
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
