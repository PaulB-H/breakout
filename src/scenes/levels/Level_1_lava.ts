import BaseScene from "../BaseScene";
import { parseMap } from "../../utility/parseMap";
import { SCENES, IMAGES, SHEETS, PIPELINES } from "../../constants";
// ANIMS

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

    // const volcanobg = this.add
    //   .sprite(80, 120, SHEETS.VolcanoBG)
    //   .setDepth(-8)
    //   .setPipeline(PIPELINES.Light2D);

    // this.anims.create({
    //   key: ANIMS.VolcanoBG_Anim,
    //   frames: this.anims.generateFrameNumbers(SHEETS.VolcanoBG, {
    //     start: 0,
    //     end: 5,
    //   }),
    //   frameRate: 3,
    //   repeat: -1,
    // });
    // volcanobg.anims.play(ANIMS.VolcanoBG_Anim);

    this.cloudTimer.stop();

    this.add
      .image(80, 180, IMAGES.NewVolcanoBG)
      .setDepth(-10)
      .setPipeline("Light2D");

    const sceneEmitter = this.add
      .particles(0, 0, SHEETS.Tiles, {
        lifespan: 10000,
        speed: { min: 0.2, max: 5 },
        scale: { start: 1, end: 1 },
        rotate: {
          min: 0,
          max: 0,
        },
        radial: false,
        gravityY: 10,
        gravityX: 0,
        emitting: false,
        frame: 52,
        angle: { min: 180, max: 180 }, // Set angle to 180 (downwards)
      })
      .setDepth(-9)
      .setPipeline(PIPELINES.Light2D);

    const myfunc = () => {
      sceneEmitter.setEmitterFrame(Phaser.Math.Between(51, 52));
      sceneEmitter.setParticleGravity(Phaser.Math.Between(-1, 0.2), 10);

      sceneEmitter.emitParticle(
        1,
        Phaser.Math.Between(0, this.game.config.width as number),
        -10
      );

      myTimer.reset(timerConfig);
    };

    const timerConfig = {
      delay: Phaser.Math.Between(50, 100), // ms
      callback: myfunc,
      //args: [],
      callbackScope: this,
      loop: true,
    };

    let myTimer = this.time.addEvent(timerConfig);
  }

  update(t: number) {
    super.update(t);
  }
}
