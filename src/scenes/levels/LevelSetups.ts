import BaseScene from "../BaseScene";

import { IMAGES, SHEETS, PIPELINES } from "../../constants";

import { PlayerSprite } from "../../objects/Player";

import { parseMap } from "../../utility/parseMap";

export const lavaSetup = (scene: BaseScene, map: Phaser.Tilemaps.Tilemap) => {
  // Remove existing lights
  scene.lights.lights.forEach((light) => {
    // console.log(`Light: X=${light.x}, Y=${light.y}, Color=${light.color}`);
    // if (light.y === 0) this.lights.removeLight(light);
    scene.lights.removeLight(light);
  });

  parseMap(scene, map);

  const backgroundImage = scene.backgroundImage;
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

  scene.cloudTimer.stop();

  scene.add
    .image(80, 180, IMAGES.NewVolcanoBG)
    .setDepth(-10)
    .setPipeline("Light2D");

  const sceneEmitter = scene.add
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
      deathZone: {
        type: "onEnter", // 'onEnter', or 'onLeave'
        source: scene.getPlayer() as PlayerSprite,
      },
    })
    .setDepth(100)
    .setPipeline(PIPELINES.Light2D);

  const myfunc = () => {
    sceneEmitter.setEmitterFrame(Phaser.Math.Between(51, 52));
    sceneEmitter.setParticleGravity(Phaser.Math.Between(-1, 0.2), 10);

    const newParticle = sceneEmitter.emitParticle(
      1,
      Phaser.Math.Between(0, scene.game.config.width as number),
      -10
    );

    class ParticleLightPair extends Phaser.Physics.Arcade.Sprite {
      private particle: Phaser.GameObjects.Particles.Particle;
      private light: Phaser.GameObjects.Light;

      constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        textureKey: string,
        particle: any
      ) {
        // Call the constructor of the parent class
        super(scene, x, y, textureKey);

        this.particle = particle;
        // console.log(this.particle);

        this.light = scene.lights.addLight(
          particle.x,
          particle.y,
          10,
          0xff3333,
          2.5
        );

        this.visible = false;

        // We need to add the sprite to the scene
        // or the preUpdate method on the class wont run
        scene.add.existing(this);
      }

      preUpdate() {
        this.light.setPosition(this.particle.x, this.particle.y);

        if (!this.particle.isAlive()) {
          this.scene.lights.removeLight(this.light);

          this.destroy();
        }
      }
    }

    new ParticleLightPair(scene, 80, 50, "null", newParticle);

    myTimer.reset(timerConfig);
  };

  const timerConfig: Phaser.Types.Time.TimerEventConfig = {
    delay: Phaser.Math.Between(50, 100), // ms
    callback: myfunc,
    //args: [],
    callbackScope: this,
    loop: true,
  };

  let myTimer = scene.time.addEvent(timerConfig);

  scene.lights.setAmbientColor(0x5f4f4f);

  const darkGrayColor = 0x222222; // Dark gray color in hexadecimal

  // Create a Graphics object
  const graphics = scene.make.graphics();

  // Set the fill color
  graphics.fillStyle(darkGrayColor, 1);

  // Draw a rectangle with the fill color
  graphics.fillRect(0, 0, 800, 600); // Adjust the dimensions as needed

  // Generate a texture from the Graphics object
  graphics.generateTexture("darkGray", 800, 600);

  // Add the dark gray texture as an image to the scene
  scene.add.image(80, 120, "darkGray").setDepth(-99).setPipeline("Light2D");

  //////
  //////
  //////

  // this.lights.addLight(80, 50, 10, 0x3fffff, 1);

  scene.lights.addLight(80, 100, 110, 0x4f4f4f, 1);

  //////
  //////
  //////
};
