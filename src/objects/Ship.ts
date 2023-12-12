import { SHEETS } from "../constants";

// This ship sprite (non physics) "attaches" to the
// platform by matching its x position in preUpdate(){}
export default class Ship extends Phaser.GameObjects.Sprite {
  platform: Phaser.Physics.Arcade.Sprite;

  ships = {
    base: { stopped: 0, left: 10, right: 20 },
    vanu: { stopped: 1, left: 11, right: 21 },
    orb: { stopped: 2, left: 12, right: 22 },
    snowflake: { stopped: 3, left: 13, right: 23 },
    lightning: { stopped: 4, left: 14, right: 24 },
  };

  shipFrames: { stopped: number; left: number; right: number } =
    this.ships.base;

  set shipType(type: "base" | "vanu" | "orb" | "snowflake" | "lightning") {
    this.shipFrames = this.ships[type];
  }

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    platform: Phaser.Physics.Arcade.Sprite
  ) {
    super(scene, x, y + 10, SHEETS.ships);

    this.platform = platform;

    this.shipType = "base";

    this.scene.add.existing(this);
  }
  preUpdate() {
    this.x = this.platform.x;
  }
}
