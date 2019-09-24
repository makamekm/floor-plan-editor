import { FloorplanListItemDto } from "../models/floor-list.dto";
import { observable, IObservableArray } from "mobx";
import debounce from "debounce";
import { inject } from "react-ioc";
import { FloorProvider } from "./floor.provider";

export class FloorListService {
  @observable loading: boolean = true;
  @observable opened: boolean = false;
  @observable list: IObservableArray<FloorplanListItemDto> = <any>[];

  private setLoading = debounce<(value: boolean) => void>(value => {
    this.loading = value;
  }, 50);

  @inject(FloorProvider) private floorProvider: FloorProvider;

  public async loadList(projectId: number | string) {
    this.setLoading(true);
    try {
      const list = await this.floorProvider.getFloorList(projectId);
      this.list.replace(list);
    } catch (error) {
      console.error(error);
    } finally {
      this.setLoading(false);
    }
  }
}