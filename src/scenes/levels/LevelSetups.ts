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

  const emberEmitter = scene.add
    .particles(0, 0, SHEETS.Tiles, {
      lifespan: 30000,
      scale: { start: 1, end: 1 },
      emitting: false,
      frame: 52,
      angle: 180,
      deathZone: {
        type: "onEnter", // 'onEnter', or 'onLeave'
        source: scene.getPlayer() as PlayerSprite,
      },
    })
    .setDepth(100)
    .setPipeline(PIPELINES.Light2D);

  const createEmber = () => {
    emberEmitter.setEmitterFrame(Phaser.Math.Between(51, 52));

    // This seems to affects EVERY particle from the emitter / currently active just the same
    emberEmitter.setParticleGravity(Phaser.Math.Between(-2, 2), 12);

    // We emit the particles horizontally on both sides past the camera bounds slightly
    // so if gravity is pushing them to one side, there is less of an empty area
    const newParticle = emberEmitter.emitParticle(
      1,
      Phaser.Math.Between(-80, (scene.game.config.width as number) + 80),
      -10
    );

    newParticle.maxVelocityY = Phaser.Math.Between(7, 12);

    class ParticleLightPair extends Phaser.Physics.Arcade.Sprite {
      private particle: Phaser.GameObjects.Particles.Particle;
      // private light: Phaser.GameObjects.Light;

      private light: Phaser.GameObjects.PointLight;

      constructor(
        scene: Phaser.Scene,
        particle: Phaser.GameObjects.Particles.Particle
      ) {
        const x = 0;
        const y = 0;
        const textureKey = "null";

        super(scene, x, y, textureKey);

        this.particle = particle;

        // Glow only works on specific things
        // Maybe I somehow to get it to work with a particle...
        // this.preFX.addGlow();

        // this.light = scene.lights.addLight(
        //   particle.x,
        //   particle.y,
        //   10,
        //   0xff3333,
        //   3
        // );

        this.light = scene.lights.addPointLight(
          particle.x,
          particle.y,
          0xff3333,
          10,
          0.1,
          0.05
        );

        // The particle is already visible, and so is the light
        // we don't actually want the sprite visible though...
        this.visible = false;

        // BUT we do need to add the sprite to the scene
        // or the preUpdate method on it wont run
        scene.add.existing(this);
      }

      preUpdate() {
        this.light.setPosition(this.particle.x, this.particle.y);

        if (!this.particle.isAlive()) {
          // this.scene.lights.removeLight(this.light);
          this.light.destroy();

          this.destroy();
        }
      }
    }

    new ParticleLightPair(scene, newParticle);

    emberTimer.reset(emberTimerConfig);
  };

  const emberTimerConfig: Phaser.Types.Time.TimerEventConfig = {
    delay: 250,
    callback: createEmber,
    loop: true,
  };

  const emberTimer = scene.time.addEvent(emberTimerConfig);

  // scene.lights.setAmbientColor(0);
  scene.lights.setAmbientColor(0x2f2f2f);

  // Black background
  scene.add.graphics().fillStyle(0, 1).fillRect(0, 0, 160, 240).setDepth(-99);

  // Add light near top of volcano
  const volcanoLight = scene.lights.addLight(80, 100, 110, 0x6f3f3f, 4);

  // Make volcano light pulse
  scene.tweens.add({
    targets: volcanoLight,
    intensity: 7,
    duration: 5000,
    yoyo: true,
    repeat: -1,
    repeatDelay: 2000,
    // onYoyo: function () {
    //   console.log("Yoyo");
    // },
  });
};
