import { ItemEnum } from "./item.enum";
import { Item } from "./item.model";
import { TableItem } from "./table.item.model";

export const ItemDict: {
  [key: number]: typeof Item;
} = {
  [ItemEnum.Table]: TableItem,
};

export const ItemNameDict = {
  [ItemEnum.Table]: "Table",
};

export const ItemArray = [
  ItemEnum.Table,
]