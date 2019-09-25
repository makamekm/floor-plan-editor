import { useRouter } from "next/router";
import { observable, reaction } from "mobx";
import debounce from "debounce";
import { inject } from "react-ioc";
import { FloorProvider } from "./floor.provider";
import { FloorDto, FloorplanDataDto, FloorplanDto } from "../models/floor.dto";
import { BlueprintService } from "./blueprint.service";
import { ProjectService } from "./project.service";
import { useEffect } from "react";
import { useDisposable, useComputed } from "mobx-react-lite";
import { useCallback } from "../utils/callback";

export class FloorService {
  @observable loading: boolean = false;

  private setLoading = debounce<(value: boolean) => void>(value => {
    this.loading = value;
  }, 50);

  @observable floor: {
    id?: number | string;
    data: FloorplanDataDto;
  } = {
    id: null,
    data: null,
  };

  @inject(FloorProvider) private floorProvider: FloorProvider;
  @inject(ProjectService) private projectService: ProjectService;
  @inject(BlueprintService) private blueprintService: BlueprintService;
  private router = useRouter();

  constructor() {
    useEffect(() => {
      if (this.router.query.id != null) {
        this.loadFloor(String(this.router.query.id));
      } else {
        this.floor.id = null;
        this.blueprintService.setFloorplan(null);
      }
    }, []);

    useCallback(this.blueprintService.onStateChange, () => {
      this.saveState();
    });
  }

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

  public async loadFloor(id: string | number) {
    this.setLoading(true);
    await this.projectService.loadProject(this.projectService.project.id);
    try {
      const floor = await this.floorProvider.getFloorplan(this.projectService.project.id, id);
      this.floor = floor;
      this.blueprintService.setFloorplan(floor.plan);
    } catch (error) {
      console.error(error);
    } finally {
      this.setLoading(false);
    }
  }

  public async openPublicFloor(id: number | string, projectId: number | string = this.projectService.project.id) {
    this.router.push('/[project_id]/view/[id]', '/' + String(projectId) + '/view/' + String(id));
  }

  public async openFloor(id: number | string, projectId: number | string = this.projectService.project.id) {
    this.router.push('/[project_id]/[id]', '/' + String(projectId) + '/' + String(id));
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
        this.openFloor(data.id);
      } else {
        alert('Please draw something');
      }
    } catch (error) {
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
          this.projectService.openProject(
            this.projectService.project.id,
          );
          this.floor.id = null;
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