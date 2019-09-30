import debounce from "debounce";
import { observable } from "mobx";
import { NextRouter, useRouter } from "next/router";
import { inject, useInstance } from "react-ioc";
import { FloorListService } from "./floor-list.service";
import { ProjectService } from "./project.service";
import { IRootService } from "./root-sevice.interface";

export class FloorRouterService implements IRootService {

  @observable public loading: boolean = false;

  private setLoading = debounce<(value: boolean) => void>((value) => {
    this.loading = value;
  }, 50);

  private floorListService: FloorListService;
  private projectService: ProjectService;
  private router: NextRouter;

  public useHook() {
    this.router = useRouter();

    // Lazy injection
    this.floorListService = useInstance(FloorListService);
    this.projectService = useInstance(ProjectService);
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
}
