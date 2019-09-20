import { Floorplan } from "./floorplan";

export interface ItemMetadata {
  id?: number;
  name: string;
  description: string;
  type: number;
}

export class Item {

  /** Constructs an item. 
   * @param floorplan The associated floorplan.
   * @param x X coordinate.
   * @param y Y coordinate.
   */
  constructor(
    private floorplan: Floorplan,
    public x: number,
    public y: number,
    public metadata: ItemMetadata,
  ) {
    
  }

  /** Remove callback. Fires the delete callbacks. */
  public remove() {
    this.floorplan.removeItem(this);
  }
}