import BaseScene from "../BaseScene";

import { IMAGES, SHEETS, PIPELINES, ANIMS } from "../../constants";

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

  scene.cloudTimer.stop();

  scene.add.image(80, 175, IMAGES.volcano).setDepth(-97).setPipeline("Light2D");

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

    newParticle!.maxVelocityY = Phaser.Math.Between(7, 12);

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

    new ParticleLightPair(scene, newParticle!);

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

  // Add lights near top of volcano
  const volcanoLight = scene.lights.addLight(100, 100, 110, 0x6f3f3f, 2);
  const volcanoLight2 = scene.lights.addLight(60, 100, 110, 0x6f3f3f, 2);
  // scene.lights.addLight(80, 100, 110, 0x6f3f3f, 2);
  const genTweenConfig = (light: Phaser.GameObjects.Light) => {
    return {
      targets: light,
      intensity: 7,
      duration: Phaser.Math.Between(500, 3000),
      yoyo: true,
      delay: Phaser.Math.Between(0, 500),
      // onYoyo is called when we reach the value in our tween
      // and then we start going back to targets initial value
      // onYoyo: () => {
      // console.log("Yoyo");
      // },
      onComplete: () => {
        scene.tweens.add(genTweenConfig(light));
      },
      // onStart: () => {
      //   console.log("start");
      // },
    };
  };

  scene.tweens.add(genTweenConfig(volcanoLight));
  scene.tweens.add(genTweenConfig(volcanoLight2));

  if (!scene.anims.exists(ANIMS.lavafall)) {
    scene.anims.create({
      key: ANIMS.lavafall,
      frames: scene.anims.generateFrameNumbers(SHEETS.lavafall, {
        start: 0,
        end: 15,
      }),
      frameRate: 10,
      repeat: -1,
    });
  }
  if (!scene.anims.exists(ANIMS.lavafall_top)) {
    scene.anims.create({
      key: ANIMS.lavafall_top,
      frames: scene.anims.generateFrameNumbers(SHEETS.lavafall_top, {
        start: 0,
        end: 15,
      }),
      frameRate: 10,
      repeat: -1,
    });
  }

  const placeLavafall = (x: number, y: number) => {
    return scene.add
      .sprite(x, y, SHEETS.lavafall)
      .setPipeline(PIPELINES.Light2D)
      .setDepth(-98)
      .anims.play(ANIMS.lavafall);
  };

  // We use two top layers so the glow effect is only visible from the top
  // otherwise, we can see the glow project in all directions
  // Couldn't find a way to specify glow direction...
  for (let i = 0; i < 6; i++) {
    const x = 16 + 8 + 16 + i * 16;
    const y = 16 * 7;

    const sprite: Phaser.GameObjects.Sprite = scene.add.sprite(
      x,
      y,
      SHEETS.lavafall_top
    );

    sprite
      .setPipeline(PIPELINES.Light2D)
      .setDepth(-98)
      .anims.play(ANIMS.lavafall_top);

    sprite.postFX.addGlow(0x8f0f0f, 2, 0, false, undefined, 15);
  }
  for (let i = 0; i < 6; i++) {
    const x = 16 + 8 + 16 + i * 16;
    const y = 16 * 7;

    const sprite: Phaser.GameObjects.Sprite = scene.add.sprite(
      x,
      y,
      SHEETS.lavafall_top
    );

    sprite
      .setPipeline(PIPELINES.Light2D)
      .setDepth(-98)
      .anims.play(ANIMS.lavafall_top);
  }

  // Yes I manually calculated the position for the lavafall here...
  // ... This will be something handled by the map parser & placed in Tiled editor
  for (let i = 0; i < 8; i++) {
    const x = 16 + 8 + i * 16;
    const y = 16 * 8;
    placeLavafall(x, y);
  }
  for (let i = 0; i < 8; i++) {
    const x = 16 + 8 + i * 16;
    const y = 16 * 9;
    placeLavafall(x, y);
  }
  for (let i = 0; i < 9; i++) {
    const x = 8 + i * 16;
    const y = 16 * 10;
    placeLavafall(x, y);
  }
  for (let i = 0; i < 9; i++) {
    const x = 8 + i * 16;
    const y = 16 * 11;
    placeLavafall(x, y);
  }
  for (let i = 0; i < 9; i++) {
    const x = 8 + i * 16;
    const y = 16 * 12;
    placeLavafall(x, y);
  }
  for (let i = 0; i < 9; i++) {
    const x = 16 + 8 + 16 + i * 16;
    const y = 16 * 13;
    placeLavafall(x, y);
  }
  for (let i = 0; i < 9; i++) {
    const x = 8 + i * 16;
    const y = 16 * 14;
    placeLavafall(x, y);
  }
  for (let i = 0; i < 9; i++) {
    const x = 16 + 8 + 16 + i * 16;
    const y = 16 * 15;
    placeLavafall(x, y);
  }
};
