import { ItemEnum } from "./item.enum";
import { Item } from "./item.model";
import { TableItem } from "./table.item.model";
import { LabelItem } from "./label.item.model";

export const ItemDict: {
  [key: number]: typeof Item;
} = {
  [ItemEnum.Table]: TableItem,
  [ItemEnum.Label]: LabelItem,
};

export const ItemNameDict = {
  [ItemEnum.Table]: "Table",
  [ItemEnum.Label]: "Label",
};

export const ItemArray = [
  ItemEnum.Table,
  ItemEnum.Label,
];
