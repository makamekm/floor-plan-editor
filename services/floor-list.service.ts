import debounce from "debounce";
import { IObservableArray, observable } from "mobx";
import { inject } from "react-ioc";
import { FloorplanListItemDto } from "../models/floor-list.dto";
import { FloorDto } from "../models/floor.dto";
import { useRouterChange } from "../utils/router-hook";
import { FloorProvider } from "./floor.provider";
import { IRootService } from "./root-sevice.interface";

export class FloorListService implements IRootService {
  @observable public loading: boolean = false;
  @observable public opened: boolean = false;
  @observable public list: IObservableArray<FloorDto> = [] as any;

  private setLoading = debounce<(value: boolean) => void>((value) => {
    this.loading = value;
  }, 50);

  @inject(FloorProvider) private floorProvider: FloorProvider;

  public useHook() {
    useRouterChange(this.onRouterChange);
  }

  public onRouterChange = () => {
    this.opened = false;
  }

  public async loadList(projectId: number | string) {
    this.setLoading(true);
    try {
      const list = await this.floorProvider.getFloorplanList(projectId);
      this.list.replace(list);
    } catch (error) {
      // tslint:disable-next-line
      console.error(error);
    } finally {
      this.setLoading(false);
    }
  }
}
