import BaseScene from "../BaseScene";
import { parseMap } from "../../utility/parseMap";

export default class Test_Nudge extends BaseScene {
  constructor() {
    super("Test_Nudge");
  }

  preload() {
    super.preload();
  }

  create() {
    super.create();

    // Create Tilemap
    const map = this.make.tilemap({
      key: "Test_Nudge",
      tileWidth: 16,
      tileHeight: 16,
    });
    map.addTilesetImage("breakout-extruded", "tiles");

    // // Create reference to tileset & its data
    // const tileset = map.getTileset(
    //   "breakout-extruded"
    // ) as Phaser.Tilemaps.Tileset;

    parseMap(this, map);

    // Create deco layer
    // map.createLayer("deco", tileset)!.setPipeline("Light2D");
  }

  update(t: number) {
    super.update(t);
  }
}
