import { SHEETS } from "../constants";
import BaseScene from "../scenes/BaseScene";

export interface iPlayer extends Phaser.Types.Tilemaps.TiledObject {
  x: number;
  y: number;
  gid: number;
}

export class PlayerSprite extends Phaser.Physics.Arcade.Sprite {
  shiplight: Phaser.GameObjects.Light | null;

  constructor(scene: BaseScene, x: number, y: number) {
    super(scene, x, y, SHEETS.Tiles, 10);

    // this.shiplight = scene.lights.addLight(80, 120, 1000, 0x7f0000, 1);
    this.shiplight = null;
  }

  contains(x: number, y: number) {
    return this.getBounds().contains(x, y);
  }

  preUpdate() {
    if (this.shiplight) this.shiplight.setPosition(this.x, this.y);
  }
}
