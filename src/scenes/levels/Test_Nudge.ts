import BaseScene from "../BaseScene";
import { parseMap } from "../../utility/parseMap";
import { SCENES, IMAGES, SHEETS } from "../../constants";

// This scene exists to test the position nudging of the AI
// so it doesn't get stuck in a vertical bouncing loop

export default class Test_Nudge extends BaseScene {
  constructor() {
    super(SCENES.Test_Nudge);
  }

  preload() {
    super.preload();
  }

  create() {
    super.create();

    // Create Tilemap
    const map = this.make.tilemap({
      key: SCENES.Test_Nudge,
      tileWidth: 16,
      tileHeight: 16,
    });
    map.addTilesetImage(IMAGES.BreakoutExtruded, SHEETS.Tiles);

    // // Create reference to tileset & its data
    // const tileset = map.getTileset(
    //   IMAGES.BreakoutExtruded
    // ) as Phaser.Tilemaps.Tileset;

    parseMap(this, map);

    // Create deco layer
    // map.createLayer("deco", tileset)!.setPipeline("Light2D");
  }

  update(t: number) {
    super.update(t);
  }
}
