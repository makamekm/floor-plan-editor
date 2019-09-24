import { useRouter, Router } from "next/router";
import { observable, computed } from "mobx";
import debounce from "debounce";
import { inject } from "react-ioc";
import { FloorProvider } from "./floor.provider";
import { ProjectDto } from "../models/project-list.dto";
import { ProjectListService } from "./project-list.service";
import { FloorListService } from "./floor-list.service";
import { useEffect } from "react";

export class ProjectService {
  @observable loading: boolean = false;

  private setLoading = debounce<(value: boolean) => void>(value => {
    this.loading = value;
  }, 50);

  @observable public data: {
    project: ProjectDto;
  } = {
    project: null,
  };

  @computed public get project() {
    return this.data.project;
  }

  @inject(FloorProvider) private floorProvider: FloorProvider;
  @inject(ProjectListService) private projectListService: ProjectListService;
  @inject(FloorListService) private floorListService: FloorListService;
  private router = useRouter();

  constructor() {
    useEffect(() => {
      if (this.router.query.project_id != null) {
        this.loadProject(<string>this.router.query.project_id);
      }
    }, []);
  }

  public async loadProject(id: number | string = this.project.id) {
    this.data.project = {
      id,
      name: '',
    };

    this.setLoading(true);
    try {
      const project = await this.floorProvider.getProject(id);
      this.data.project = project;
      await this.floorListService.loadList(project.id);
    } catch (error) {
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
      this.router.push('/' + String(id) + '/' + String(firstPlan.id));
    } else {
      this.router.push('/[project_id]', '/' + String(id));
    }
  }

  public async openProjectCreatePlan(id: number | string = this.data.project.id) {
    this.router.push('/[project_id]', '/' + String(id));
  }

  public async openProjectList() {
    this.router.push('/', '/');
  }

  public async saveProject() {
    this.setLoading(true);
    try {
      const project = await this.floorProvider.saveProject(this.data.project);
      this.data.project = project;
      await this.projectListService.loadList();
    } catch (error) {
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
      console.error(error);
    } finally {
      this.setLoading(false);
    }
  }
}