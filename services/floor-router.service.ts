import debounce from "debounce";
import { observable } from "mobx";
import { NextRouter, useRouter } from "next/router";
import { useEffect } from "react";
import { useInstance } from "react-ioc";
import { useRouterChange, useRouterChangeStart } from "../utils/router-hook";
import { FloorListService } from "./floor-list.service";
import { ProjectService } from "./project.service";
import { IRootService } from "./root-sevice.interface";

export class FloorRouterService implements IRootService {

  @observable public loading: boolean = false;

  private setLoading = debounce<(value: boolean) => void>((value) => {
    this.loading = value;
  }, 500);

  private floorListService: FloorListService;
  private projectService: ProjectService;
  private router: NextRouter;

  public useHook() {
    this.router = useRouter();
    this.floorListService = useInstance(FloorListService);
    this.projectService = useInstance(ProjectService);
    useRouterChange(this.onRouterChange);
    useRouterChangeStart(this.onRouterChangeStart);
    useEffect(() => {
      window.onbeforeunload = () => {
        this.loading = true;
      };
    }, []);
  }

  public async openProject(id: number | string) {
    await this.floorListService.loadList(id);
    const firstPlan = this.floorListService.list[0];
    if (firstPlan) {
      this.router.push("/" + String(id) + "/" + String(firstPlan.id));
    } else {
      this.router.push("/[project_id]", "/" + String(id));
    }
  }

  public async openProjectCreatePlan(id: number | string = this.projectService.project.id) {
    this.router.push("/[project_id]", "/" + String(id));
  }

  public async openProjectList() {
    this.router.push("/", "/");
  }

  public async openPublicFloor(id: number | string, projectId: number | string = this.projectService.project.id) {
    this.router.push("/[project_id]/view/[id]", "/" + String(projectId) + "/view/" + String(id));
  }

  public async openFloor(id: number | string, projectId: number | string = this.projectService.project.id) {
    this.router.push("/[project_id]/[id]", "/" + String(projectId) + "/" + String(id));
  }

  private onRouterChangeStart = () => {
    this.loading = true;
  }

  private onRouterChange = () => {
    this.setLoading(false);
  }
}
