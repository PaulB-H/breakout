// import Phaser from "phaser";

import BaseScene from "./BaseScene";

// import { AUDIO } from "../../constants";

import { parseMap } from "../utility/parseMap";

export default class DemoScene extends BaseScene {
  constructor() {
    super("DemoScene");
  }

  preload() {
    super.preload();
  }

  create() {
    super.create();
    // Create Tilemap
    const map = this.make.tilemap({
      key: "DemoScene",
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
