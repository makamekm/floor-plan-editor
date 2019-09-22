import { observable, computed } from "mobx";
import debounce from "debounce";
import { inject } from "react-ioc";
import { FloorProvider } from "./floor.provider";
import { BlueprintService } from "./blueprint.service";
import { FloorService } from "./floor.service";

export class FloorEditService {
  @observable loading: boolean = true;
  @observable opened: boolean = false;
  @inject(BlueprintService) blueprintService: BlueprintService;
  @inject(FloorService) floorService: FloorService;

  @computed get data() {
    return this.floorService.floor.data || {};
  }

  private setLoading = debounce<(value: boolean) => void>(value => {
    this.loading = value;
  }, 50);

  @inject(FloorProvider) private floorProvider: FloorProvider;

}