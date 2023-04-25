import BaseScene from "../BaseScene";
import { parseMap } from "../../utility/parseMap";

export default class Level_2 extends BaseScene {
  constructor() {
    super("Level_2");
  }

  preload() {
    super.preload();
  }

  create() {
    super.create();
    // Create Tilemap
    const map = this.make.tilemap({
      key: "Level_2",
      tileWidth: 16,
      tileHeight: 16,
    });
    map.addTilesetImage("breakout-extruded", "tiles");

    // Create reference to tileset & its data
    const tileset = map.getTileset(
      "breakout-extruded"
    ) as Phaser.Tilemaps.Tileset;

    parseMap(this, map);

    map.createLayer("deco", tileset)!.setPipeline("Light2D");
  }

  update(t: number) {
    super.update(t);
  }
}
