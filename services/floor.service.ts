import { useRouter, Router } from "next/router";
import { observable } from "mobx";
import debounce from "debounce";
import { inject } from "react-ioc";
import { FloorProvider } from "./floor.provider";
import { FloorplanDataDto, FloorplanDto } from "../models/floor.dto";
import { BlueprintService } from "./blueprint.service";
import { ProjectService } from "./project.service";
import { useEffect } from "react";

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
  @inject(ProjectService) private projectService: ProjectService;
  @inject(BlueprintService) private blueprintService: BlueprintService;
  private router = useRouter();

  constructor() {
    useEffect(() => {
      if (this.router.query.id != null) {
        this.loadFloor(Number.parseInt(<string>this.router.query.id, 10));
      }
    }, []);
  }

  public async loadFloor(id: number) {
    this.setLoading(true);
    await this.projectService.loadProject(this.projectService.project.id);
    try {
      const [plan, data]: [
        FloorplanDto,
        FloorplanDataDto,
      ] = await Promise.all([
        this.floorProvider.getFloorplan(this.projectService.project.id, id),
        this.floorProvider.getFloorplanData(this.projectService.project.id, id),
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

  public async openPublicFloor(id: number | string, projectId: number | string = this.projectService.project.id) {
    // this.router.push('/[project_id]/view/[id]', '/' + String(projectId) + '/view/' + String(id));
    this.router.push('/' + String(projectId) + '/view/' + String(id));
  }

  public async openFloor(id: number | string, projectId: number | string = this.projectService.project.id) {
    this.router.push('/[project_id]/[id]', '/' + String(projectId) + '/' + String(id));
    // this.router.push('/' + String(projectId) + '/' + String(id));
  }

  public async saveFloor() {
    this.setLoading(true);
    try {
      const [plan, data]: [
        FloorplanDto,
        FloorplanDataDto,
      ] = await Promise.all([
        this.floorProvider.saveFloorPlan(
          this.projectService.project.id,
          this.floor.data.id,
          this.floor.plan,
        ),
        this.floorProvider.saveFloorplanData(
          this.projectService.project.id,
          this.floor.data.id,
          this.floor.data,
        ),
      ]);
      this.floor.plan = plan;
      this.floor.data = data;
      await this.projectService.loadProject(this.projectService.project.id);
    } catch (error) {
      console.error(error);
    } finally {
      this.setLoading(false);
    }
  }

  public async createFloor(name: string) {
    this.setLoading(true);
    try {
      const data = await this.floorProvider.createFloorplan(
        this.projectService.project.id,
        name,
        this.floor.plan,
      );
      this.openFloor(data.id);
    } catch (error) {
      console.error(error);
    } finally {
      this.setLoading(false);
    }
  }

  public async deleteFloor(id: number | string = this.floor.data.id) {
    this.setLoading(true);
    try {
      const result = await this.floorProvider.deleteFloorPlan(
        this.projectService.project.id,
        id,
      );
      if (result) {
        await this.projectService.loadProject(this.projectService.project.id);
        if (this.floor.data.id === id) {
          this.projectService.openProject(
            this.projectService.project.id,
          );
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