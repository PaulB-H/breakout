import BaseScene from "../scenes/BaseScene";

import { PIPELINES, SHEETS } from "../constants";

export class FireBall extends Phaser.Physics.Arcade.Sprite {
  type = "fireball";
  constructor(
    scene: BaseScene,
    x: number,
    y: number,
    texture = SHEETS.Tiles,
    frame = 42
  ) {
    super(scene, x, y, texture, frame);

    scene.physics.add.existing(this);
    scene.add.existing(this);

    scene.addToProjectileGrp(this);

    this.setPipeline("Light2D");

    this.setSize(14, 13);

    this.setVelocityY(100);
  }
}

export class LightningBolt extends Phaser.Physics.Arcade.Sprite {
  type = "lightningbolt";
  constructor(
    scene: BaseScene,
    x: number,
    y: number,
    texture = SHEETS.Tiles,
    frame = 53
  ) {
    super(scene, x, y, texture, frame);

    scene.physics.add.existing(this);
    scene.add.existing(this);

    scene.addToProjectileGrp(this);

    this.setPipeline("Light2D");

    this.setSize(9, 16);

    this.setVelocityY(250);
  }
}

export class LaserBeam extends Phaser.Physics.Arcade.Sprite {
  type = "laserbeam";
  constructor(
    scene: BaseScene,
    x: number,
    y: number,
    texture = SHEETS.Tiles,
    frame = 49
  ) {
    super(scene, x, y, texture, frame);

    scene.physics.add.existing(this);
    scene.add.existing(this);

    scene.addToProjectileGrp(this);

    this.setSize(3, 14);

    this.setVelocityY(500);
  }
}

export class IceSpike extends Phaser.Physics.Arcade.Sprite {
  type = "icespike";
  constructor(
    scene: BaseScene,
    x: number,
    y: number,
    texture = SHEETS.Tiles,
    frame = 65
  ) {
    super(scene, x, y, texture, frame);

    scene.physics.add.existing(this);
    scene.add.existing(this);

    scene.addToProjectileGrp(this);

    this.setSize(3, 14);

    this.setPipeline(PIPELINES.Light2D);

    // this.setVelocityY(500);
    this.setAccelerationY(100);
  }
}
