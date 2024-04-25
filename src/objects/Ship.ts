import { SHEETS } from "../constants";

export const ships = {
  base: { stopped: 0, left: 10, right: 20 },
  vanu: { stopped: 1, left: 11, right: 21 },
  orb: { stopped: 2, left: 12, right: 22 },
  snowflake: { stopped: 3, left: 13, right: 23 },
  lightning: { stopped: 4, left: 14, right: 24 },
  fireball: { stopped: 5, left: 15, right: 25 },
};

export type validShipTypes =
  | "base"
  | "vanu"
  | "orb"
  | "snowflake"
  | "lightning"
  | "fireball";

export const shipTypeArray = [
  "base",
  "orb",
  "lightning",
  "fireball",
  "snowflake",
  "vanu",
] as const;

// This ship sprite (non physics) "attaches" to the
// platform by matching its x position in preUpdate(){}
export default class Ship extends Phaser.GameObjects.Sprite {
  platform: Phaser.Physics.Arcade.Sprite;

  ships = ships;

  shipFrames: { stopped: number; left: number; right: number } =
    this.ships.base;

  setShipType(type: validShipTypes) {
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

    this.setShipType(scene.registry.get("shipType"));

    this.scene.add.existing(this);
  }
  preUpdate() {
    this.x = this.platform.x;
  }
}
