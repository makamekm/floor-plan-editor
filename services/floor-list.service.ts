import { FloorplanListItemDto } from "../models/floor-list.dto";
import { observable, IObservableArray } from "mobx";
import debounce from "debounce";
import { inject } from "react-ioc";
import { FloorProvider } from "./floor.provider";
import { FloorDto } from "../models/floor.dto";
import { IRootService } from "./root-sevice.interface";
import { useRouterChange } from "../utils/router-hook";

export class FloorListService implements IRootService {
  @observable loading: boolean = false;
  @observable opened: boolean = false;
  @observable list: IObservableArray<FloorDto> = <any>[];

  private setLoading = debounce<(value: boolean) => void>(value => {
    this.loading = value;
  }, 50);

  @inject(FloorProvider) private floorProvider: FloorProvider;

  useHook() {
    useRouterChange(this.onRouterChange);
  }

  onRouterChange = () => {
    this.opened = false;
  }

  public async loadList(projectId: number | string) {
    this.setLoading(true);
    try {
      const list = await this.floorProvider.getFloorplanList(projectId);
      this.list.replace(list);
    } catch (error) {
      console.error(error);
    } finally {
      this.setLoading(false);
    }
  }
}