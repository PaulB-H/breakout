import BaseScene from "../BaseScene";
import { parseMap } from "../../utility/parseMap";
import { SCENES, IMAGES, SHEETS } from "../../constants";

export default class Level_1_lava extends BaseScene {
  constructor() {
    super(SCENES.Level_1_lava);
  }

  preload() {
    super.preload();
  }

  create() {
    super.create();

    // Create Tilemap
    const map = this.make.tilemap({
      key: SCENES.Level_1_lava,
      tileWidth: 16,
      tileHeight: 16,
    });
    map.addTilesetImage(IMAGES.BreakoutExtruded, SHEETS.Tiles);

    parseMap(this, map);

    const backgroundImage = this.backgroundImage;
    if (backgroundImage) {
      backgroundImage.destroy();
    }

    const volcanobg = this.add
      .sprite(80, 120, "volcanobg")
      .setDepth(-8)
      .setPipeline("Light2D");
    this.anims.create({
      key: "volcanobg_anim",
      frames: this.anims.generateFrameNumbers("volcanobg", {
        start: 0,
        end: 5,
      }),
      frameRate: 3,
      repeat: -1,
    });
    volcanobg.anims.play("volcanobg_anim");
  }

  update(t: number) {
    super.update(t);
  }
}
