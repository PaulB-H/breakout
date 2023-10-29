import BaseScene from "../BaseScene";
import { SCENES, IMAGES, SHEETS } from "../../constants";
import { lavaSetup } from "./LevelSetups";

export default class Lava_2 extends BaseScene {
  constructor() {
    super(SCENES.lava_2);
  }

  preload() {
    super.preload();
  }

  create() {
    super.create();

    // Create Tilemap
    const map = this.make.tilemap({
      key: SCENES.lava_2,
      tileWidth: 16,
      tileHeight: 16,
    });
    map.addTilesetImage(IMAGES.BreakoutExtruded, SHEETS.Tiles);

    lavaSetup(this, map);
  }

  update(t: number) {
    super.update(t);
  }
}
