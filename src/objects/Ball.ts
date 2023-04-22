// Classes need to know about the custom properties on DemoScene
import DemoScene from "../DemoScene";

export class Ball extends Phaser.Physics.Arcade.Sprite {
  gid: number;
  ballLight: Phaser.GameObjects.Light | null;
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

    scene.ballGroup.add(this);

    this.ballLight = null;
    this.ballLight = scene.lights.addLight(80, 120, 100, 0xffffff, 0.5);

    // this.setPipeline("Light2D");

    this.setCircle(4, 4, 4);

    this.setBounce(1);

    // TS says read-only property - type assertion resolved
    (this.body as Phaser.Physics.Arcade.Body).onWorldBounds = true;

    if (scene.clamped) {
      this.x = scene.player.x;
      this.setVelocityY(0);
    }
  }
  preUpdate() {
    if (this.ballLight) this.ballLight.setPosition(this.x, this.y);
  }

  destroy() {
    if (this.scene) {
      if (this.ballLight) this.scene.lights.removeLight(this.ballLight);
      super.destroy(true);
    }
  }
}
export interface iBall extends Phaser.Types.Tilemaps.TiledObject {
  x: number;
  y: number;
  gid: number;
}
