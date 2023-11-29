import BaseScene from "../BaseScene";
import { SCENES, IMAGES, SHEETS } from "../../constants";
import { iceSetup } from "./LevelSetups";

export default class Ice_2 extends BaseScene {
  constructor() {
    super(SCENES.ice_2);
  }

  preload() {
    super.preload();
  }

  create() {
    super.create();

    // Create Tilemap
    const map = this.make.tilemap({
      key: SCENES.ice_2,
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
