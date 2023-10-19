import BaseScene from "../BaseScene";
import { parseMap } from "../../utility/parseMap";
import { SCENES, IMAGES, SHEETS, ANIMS } from "../../constants";

export default class ice_3 extends BaseScene {
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

    parseMap(this, map);

    /********************************************/
    // Remove existing background image
    /********************************************/
    const backgroundImage = this.backgroundImage;
    if (backgroundImage) backgroundImage.destroy();

    /********************************************/
    // Add new background
    /********************************************/
    const iceBergBG = this.add
      .image(80, 130, IMAGES.IcebergBG)
      .setDepth(-1)
      .setPipeline("Light2D");
    // Make the iceberg float gently
    this.tweens.add({
      targets: iceBergBG,
      y: "+=2",
      ease: "Sine.easeInOut",
      duration: 3000,
      yoyo: true,
      repeat: -1,
    });

    /********************************************/
    // Stop animated clouds that BaseScene started
    /********************************************/
    this.cloudTimer.stop();
    // Create snow particle emitter
    const snowEmitter = this.add
      .particles(0, 0, SHEETS.Tiles, {
        lifespan: 10000,
        speed: { min: 0.2, max: 5 },
        radial: false,
        gravityY: 10,
        gravityX: 0,
        emitting: false,
        frame: 61,
        alpha: 0.75,
        angle: 180,
      })
      .setDepth(10);
    // Function to drop a random snowflake along x axis
    const dropSnowflake = () => {
      snowEmitter.setEmitterFrame(Phaser.Math.RND.pick([61, 71, 72]));
      snowEmitter.setParticleGravity(Phaser.Math.Between(-1, 0.2), 5);

      snowEmitter.emitParticle(
        1,
        Phaser.Math.Between(0, this.game.config.width as number),
        -10
      );

      snowTimer.reset(snowTimerConfig);
    };
    // We need to make a config object because we reference it
    // when calling TimerEvent.reset(timerConfig)
    const snowTimerConfig = {
      delay: Phaser.Math.Between(500, 500),
      callback: dropSnowflake,
      loop: true,
    };
    // Start snowing
    const snowTimer = this.time.addEvent(snowTimerConfig);

    /********************************************/
    // Animated water
    /********************************************/
    const water = this.add.sprite(80, 215, SHEETS.WaterLoop).setDepth(-2);
    this.anims.create({
      key: ANIMS.WaterLoopAnim,
      frames: this.anims.generateFrameNumbers(SHEETS.WaterLoop, {
        start: 0,
        end: 38,
      }),
      frameRate: 10,
      repeat: -1,
    });
    water.anims.play(ANIMS.WaterLoopAnim);
  }

  update(t: number) {
    super.update(t);
  }
}
