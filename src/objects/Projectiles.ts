import BaseScene from "../scenes/BaseScene";

export class FireBall extends Phaser.Physics.Arcade.Sprite {
  type = "fireball";
  constructor(
    scene: BaseScene,
    x: number,
    y: number,
    texture = "tiles",
    frame = 42
  ) {
    super(scene, x, y, texture, frame);

    scene.physics.add.existing(this);
    scene.add.existing(this);

    scene.addToProjectileGrp(this);

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
    texture = "tiles",
    frame = 53
  ) {
    super(scene, x, y, texture, frame);

    scene.physics.add.existing(this);
    scene.add.existing(this);

    scene.addToProjectileGrp(this);

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
    texture = "tiles",
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
