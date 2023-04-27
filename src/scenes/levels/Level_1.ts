import BaseScene from "../BaseScene";
import { parseMap } from "../../utility/parseMap";
import { SCENES, IMAGES, SHEETS } from "../../constants";

export default class Level_1 extends BaseScene {
  constructor() {
    super(SCENES.Level_1);
  }

  preload() {
    super.preload();
  }

  create() {
    super.create();

    // Create Tilemap
    const map = this.make.tilemap({
      key: SCENES.Level_1,
      tileWidth: 16,
      tileHeight: 16,
    });
    map.addTilesetImage(IMAGES.BreakoutExtruded, SHEETS.Tiles);

    // Create reference to tileset & its data
    const tileset = map.getTileset(
      IMAGES.BreakoutExtruded
    ) as Phaser.Tilemaps.Tileset;

    parseMap(this, map);

    // Create deco layer
    map.createLayer("deco", tileset)!.setPipeline("Light2D");
  }

  update(t: number) {
    super.update(t);
  }
}
