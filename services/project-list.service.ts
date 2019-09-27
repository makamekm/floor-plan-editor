import debounce from "debounce";
import { IObservableArray, observable, reaction } from "mobx";
import { useDisposable } from "mobx-react-lite";
import { inject } from "react-ioc";
import { ProjectListItemDto } from "../models/project-list.dto";
import { FloorProvider } from "./floor.provider";
import { IRootService } from "./root-sevice.interface";
import { UserService } from "./user.service";

export class ProjectListService implements IRootService {
  @observable public loading: boolean = false;
  @observable public opened: boolean = false;
  @observable public list: IObservableArray<ProjectListItemDto> = [] as any;
  @inject(UserService) public userService: UserService;

  private setLoading = debounce<(value: boolean) => void>((value) => {
    this.loading = value;
  }, 50);

  @inject(FloorProvider) private floorProvider: FloorProvider;

  public useHook() {
    useDisposable(() =>
      reaction(
        () => this.userService.user,
        (user) => {
          if (user) {
            this.loadList();
          }
        },
      ),
    );
  }

  public async loadList() {
    this.setLoading(true);
    try {
      const list = await this.floorProvider.getProjectList();
      this.list.replace(list);
    } catch (error) {
      console.error(error);
    } finally {
      this.setLoading(false);
    }
  }
}
