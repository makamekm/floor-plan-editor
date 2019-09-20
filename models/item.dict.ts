import { ItemEnum } from "./item.enum";
import { IItemDict } from "./item.dict.model";

export const ItemDict: {
  [key: number]: IItemDict;
} = {
  [ItemEnum.Table]: {
    render(x, y, hover, ctx, item) {
      // ctx.drawImage();
    },
    overlapped(x, y, item) {
      return false;
    },
  },
  [ItemEnum.Sign]: {
    render(x, y, hover, ctx, item) {
      // ctx.drawImage();
    },
    overlapped(x, y, item) {
      return false;
    },
  },
  [ItemEnum.Computer]: {
    render(x, y, hover, ctx, item) {
      // ctx.drawImage();
    },
    overlapped(x, y, item) {
      return false;
    },
  },
};