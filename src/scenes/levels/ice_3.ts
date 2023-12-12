import BaseScene from "../BaseScene";
import { SCENES, IMAGES, SHEETS } from "../../constants";
import { iceSetup } from "../../utility/LevelSetups";

export default class Ice_3 extends BaseScene {
  constructor() {
    super(SCENES.ice_3);
  }

  preload() {
    super.preload();
  }

  create() {
    super.create();

    // Create Tilemap
    const map = this.make.tilemap({
      key: SCENES.ice_3,
      tileWidth: 16,
      tileHeight: 16,
    });
    map.addTilesetImage(IMAGES.BreakoutExtruded, SHEETS.Tiles);

    iceSetup(this, map);
  }

  update(t: number) {
    super.update(t);
  }
}
