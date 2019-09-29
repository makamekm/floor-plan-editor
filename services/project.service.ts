import debounce from "debounce";
import { computed, observable } from "mobx";
import { NextRouter, Router, useRouter } from "next/router";
import { useEffect } from "react";
import { inject } from "react-ioc";
import { ProjectDto } from "../models/project-list.dto";
import { useRouterChange } from "../utils/router-hook";
import { FloorListService } from "./floor-list.service";
import { FloorProvider } from "./floor.provider";
import { ProjectListService } from "./project-list.service";
import { IRootService } from "./root-sevice.interface";

export class ProjectService implements IRootService {

  @computed public get project() {
    return this.data.project;
  }
  @observable public loading: boolean = false;

  @observable public data: {
    project: ProjectDto;
  } = {
    project: null,
  };

  private setLoading = debounce<(value: boolean) => void>((value) => {
    this.loading = value;
  }, 50);

  @inject(FloorProvider) private floorProvider: FloorProvider;
  @inject(ProjectListService) private projectListService: ProjectListService;
  @inject(FloorListService) private floorListService: FloorListService;
  private router: NextRouter;

  public useHook() {
    this.router = useRouter();
    useRouterChange(this.onRouterChange);
  }

  public onRouterChange = () => {
    if (this.router.query.project_id != null) {
      this.loadProject(this.router.query.project_id as string);
    }
  }

  public async loadProject(id: number | string = this.project.id) {
    this.data.project = {
      id,
      name: "",
    };

    this.setLoading(true);
    try {
      const project = await this.floorProvider.getProject(id);
      this.data.project = project;
      await this.floorListService.loadList(project.id);
    } catch (error) {
      // tslint:disable-next-line
      console.error(error);
    } finally {
      this.setLoading(false);
    }
    return this.project;
  }

  public async openProject(id: number | string) {
    this.setLoading(true);
    await this.floorListService.loadList(id);
    this.setLoading(false);

    const firstPlan = this.floorListService.list[0];

    if (firstPlan) {
      this.router.push("/" + String(id) + "/" + String(firstPlan.id));
    } else {
      this.router.push("/[project_id]", "/" + String(id));
    }
  }

  public async openProjectCreatePlan(id: number | string = this.data.project.id) {
    this.router.push("/[project_id]", "/" + String(id));
  }

  public async openProjectList() {
    this.router.push("/", "/");
  }

  public async saveProject() {
    this.setLoading(true);
    try {
      const project = await this.floorProvider.saveProject(this.data.project);
      this.data.project = project;
      await this.projectListService.loadList();
    } catch (error) {
      // tslint:disable-next-line
      console.error(error);
    } finally {
      this.setLoading(false);
    }
  }

  public async createProject(name: string) {
    this.setLoading(true);
    try {
      const data = await this.floorProvider.createProject(name);
      this.projectListService.loadList();
      this.openProject(data.id);
    } catch (error) {
      // tslint:disable-next-line
      console.error(error);
    } finally {
      this.setLoading(false);
    }
  }

  public async deleteProject(id: number | string = this.data.project.id) {
    this.setLoading(true);
    try {
      const result = await this.floorProvider.deleteProject(id);
      if (result) {
        if (this.data.project && this.data.project.id === id) {
          this.openProjectList();
        } else {
          this.projectListService.loadList();
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
