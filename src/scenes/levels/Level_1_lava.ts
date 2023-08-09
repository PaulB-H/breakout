import BaseScene from "../BaseScene";
import { parseMap } from "../../utility/parseMap";
import { SCENES, IMAGES, SHEETS, ANIMS } from "../../constants";

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
      .sprite(80, 120, SHEETS.VolcanoBG)
      .setDepth(-8)
      .setPipeline("Light2D");

    this.anims.create({
      key: ANIMS.VolcanoBG_Anim,
      frames: this.anims.generateFrameNumbers(SHEETS.VolcanoBG, {
        start: 0,
        end: 5,
      }),
      frameRate: 3,
      repeat: -1,
    });
    volcanobg.anims.play(ANIMS.VolcanoBG_Anim);
  }

  update(t: number) {
    super.update(t);
  }
}
