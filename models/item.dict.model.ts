import { Item } from "./item.model";
import { Floorplan } from "./floorplan";
import { FloorplannerView } from "./floorplanner-view";

export interface IItemDict {
  render: (
    x: number,
    y: number,
    hover: boolean,
    ctx: FloorplannerView,
    item: Item,
    floorplan: Floorplan,
  ) => void;
  overlapped: (
    x: number,
    y: number,
    item: Item,
    floorplan: Floorplan,
  ) => boolean;
}
