import BaseScene from "./BaseScene";
import { SCENES, IMAGES, SHEETS } from "../constants";
import { parseMap } from "../utility/parseMap";

export default class DemoScene extends BaseScene {
  constructor() {
    super(SCENES.DemoScene);
  }

  preload() {
    super.preload();
  }

  create() {
    super.create();
    // Create Tilemap
    const map = this.make.tilemap({
      key: SCENES.DemoScene,
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
