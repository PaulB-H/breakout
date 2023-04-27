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

    // Create reference to tileset & its data
    const tileset = map.getTileset(
      IMAGES.BreakoutExtruded
    ) as Phaser.Tilemaps.Tileset;

    parseMap(this, map);

    map.createLayer("deco", tileset)!.setPipeline("Light2D");
  }

  update(t: number) {
    super.update(t);
  }
}
