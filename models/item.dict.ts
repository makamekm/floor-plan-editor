import { ItemEnum } from "./item.enum";
import { IItemDict } from "./item.dict.model";

export const ItemDict: {
  [key: number]: IItemDict;
} = {
  [ItemEnum.Table]: {
    render(x, y, r, hover, ctx, item, floorplan) {
      // ctx.drawImage();
      console.log(hover);
      const active = floorplan.getSelectedItem() === item;
      ctx.drawCircle(x, y, 30, active ? "#0000ff" : (hover ? "#00ff00" : "#ff0000"));
    },
    overlapped(x, y, item) {
      const sens = 50;
      return x < (item.x + sens) && x > (item.x - sens)
        && y < (item.y + sens) && y > (item.y - sens);
    },
  },
  [ItemEnum.Sign]: {
    render(x, y, r, hover, ctx, item) {
      // ctx.drawImage();
    },
    overlapped(x, y, item) {
      return false;
    },
  },
  [ItemEnum.Computer]: {
    render(x, y, r, hover, ctx, item) {
      // ctx.drawImage();
    },
    overlapped(x, y, item) {
      return false;
    },
  },
};