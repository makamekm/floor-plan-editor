import debounce from "debounce";
import { IObservableArray, observable } from "mobx";
import { useInstance } from "react-ioc";
import { ProjectListItemDto } from "../models/project-list.dto";
import { useRouterChange } from "../utils/router-hook";
import { FloorProvider } from "./floor.provider";
import { IRootService } from "./root-sevice.interface";
import { UserService } from "./user.service";

export class ProjectListService implements IRootService {

  public debounceLoadList = debounce(() => {
    this.loadList();
  });

  @observable public loading: boolean = false;
  @observable public opened: boolean = false;
  @observable public list: IObservableArray<ProjectListItemDto> = [] as any;

  private userService: UserService;
  private floorProvider: FloorProvider;

  private setLoading = debounce<(value: boolean) => void>((value) => {
    this.loading = value;
  }, 50);

  public useHook() {
    this.userService = useInstance(UserService);
    this.floorProvider = useInstance(FloorProvider);
    useRouterChange(this.onRouterChange);
    this.userService.useUserChange(this.onUserChange);
  }

  private onUserChange = (user: firebase.User) => {
    if (user) {
      this.debounceLoadList();
    }
  }

  private onRouterChange = () => {
    if (this.userService.user != null) {
      this.debounceLoadList();
    } else {
      this.list.replace([]);
    }
  }

  public async loadList() {
    this.setLoading(true);
    try {
      const list = await this.floorProvider.getProjectList();
      this.list.replace(list);
    } catch (error) {
      // tslint:disable-next-line
      console.error(error);
    } finally {
      this.setLoading(false);
    }
  }
}
