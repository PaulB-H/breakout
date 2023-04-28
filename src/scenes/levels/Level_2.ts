import BaseScene from "../BaseScene";
import { parseMap } from "../../utility/parseMap";
import { SCENES, IMAGES, SHEETS } from "../../constants";

export default class Level_2 extends BaseScene {
  constructor() {
    super(SCENES.Level_2);
  }

  preload() {
    super.preload();
  }

  create() {
    super.create();

    // Create Tilemap
    const map = this.make.tilemap({
      key: SCENES.Level_2,
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
