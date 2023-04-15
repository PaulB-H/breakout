// Classes need to know about the custom properties on DemoScene
import DemoScene from "../DemoScene";

export class Ball extends Phaser.Physics.Arcade.Sprite {
  gid: number;
  constructor(
    scene: DemoScene,
    x: number,
    y: number,
    texture: string,
    frame: number
  ) {
    super(scene, x, y, texture, frame);

    this.gid = frame;

    scene.add.existing(this);
    scene.physics.add.existing(this);

    scene.balls++;

    this.setCircle(4, 4, 4);

    scene.ballGroup.add(this);

    // TS says read-only property - type assertion resolved
    (this.body as Phaser.Physics.Arcade.Body).onWorldBounds = true;

    // this.setFriction(1);

    if (scene.clamped) {
      this.x = scene.player.x;
      this.setVelocityY(0);
    }
  }
}
export interface iBall extends Phaser.Types.Tilemaps.TiledObject {
  x: number;
  y: number;
  gid: number;
}
