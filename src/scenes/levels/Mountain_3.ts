import BaseScene from "../BaseScene";
import { parseMap } from "../../utility/parseMap";
import { SCENES, IMAGES, SHEETS } from "../../constants";

export default class Mountain_3 extends BaseScene {
  constructor() {
    super(SCENES.mountain_3);
  }

  preload() {
    super.preload();
  }

  create() {
    super.create();

    // Create Tilemap
    const map = this.make.tilemap({
      key: SCENES.mountain_3,
      tileWidth: 16,
      tileHeight: 16,
    });
    map.addTilesetImage(IMAGES.BreakoutExtruded, SHEETS.Tiles);

    parseMap(this, map);
  }

  update(t: number) {
    super.update(t);
  }
}
