// Dont need to export this since its just made with CloudTimer
class Cloud extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: Phaser.Scene) {
    super(
      scene,
      -50,
      -50,
      "cloud-atlas",
      `cloud${Math.floor(Math.random() * 3 + 1)}.png`
    );

    const worldLeft = scene.physics.world.bounds.left;
    const worldHeight = scene.physics.world.bounds.height;

    this.setPosition(
      worldLeft - 32,
      Math.floor(Math.random() * worldHeight) - 75
    );

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setDepth(-1);

    this.setVelocityX(Math.floor(Math.random() * 30) + 15);
  }

  preUpdate() {
    const worldRight = this.scene.physics.world.bounds.right;
    if (this.x > worldRight + 64) {
      this.destroy();
    }
  }
}

export class CloudTimer {
  scene: Phaser.Scene;
  interval: number;
  timerEvent: Phaser.Time.TimerEvent | null;

  constructor(scene: Phaser.Scene, interval: number) {
    this.scene = scene;
    this.interval = interval;
    this.timerEvent = null;
  }

  start() {
    if (!this.timerEvent) {
      this.timerEvent = this.scene.time.addEvent({
        delay: this.interval,
        loop: true,
        callback: this.onInterval,
        callbackScope: this,
      });
    }
  }

  stop() {
    if (this.timerEvent) {
      this.timerEvent.destroy();
      this.timerEvent = null;
    }
  }

  onInterval() {
    new Cloud(this.scene);
  }
}
