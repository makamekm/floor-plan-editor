import { observable, IObservableArray, reaction } from "mobx";
import debounce from "debounce";
import { inject } from "react-ioc";
import { FloorProvider } from "./floor.provider";
import { ProjectListItemDto } from "../models/project-list.dto";
import { useComputed, useDisposable } from "mobx-react-lite";
import { UserService } from "./user.service";

export class ProjectListService {
  @observable loading: boolean = true;
  @observable opened: boolean = false;
  @observable list: IObservableArray<ProjectListItemDto> = <any>[];

  private setLoading = debounce<(value: boolean) => void>(value => {
    this.loading = value;
  }, 50);

  @inject(FloorProvider) private floorProvider: FloorProvider;
  @inject(UserService) userService: UserService;

  constructor() {
    useDisposable(() => 
      reaction(
        () => this.userService.user,
        user => {
          if (user) {
            this.loadList();
          }
        }
      )
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